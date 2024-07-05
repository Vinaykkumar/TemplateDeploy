import os
import json
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")

def send_step_message(step_message, progress):
    socketio.emit('deployment_status', {'message': step_message, 'progress': progress})

@app.route('/api/save-template', methods=['POST'])
def save_template():
    data = request.json
    template = data.get('template')
    
    if template:
        db_file = os.path.join(os.path.dirname(__file__), 'db.json')
        db_data = {}
        
        if os.path.exists(db_file):
            with open(db_file, 'r') as f:
                db_data = json.load(f)
        
        db_data['selected_template'] = template
        
        with open(db_file, 'w') as f:
            json.dump(db_data, f, indent=2)
        
        return jsonify({"message": "Template saved"}), 200
    else:
        return jsonify({"error": "No template provided"}), 400

@app.route('/api/terraform/deploy', methods=['POST'])
def deploy_terraform():
    try:
        db_file = os.path.join(os.path.dirname(__file__), 'db.json')
        
        if os.path.exists(db_file):
            with open(db_file, 'r') as f:
                db_data = json.load(f)
                template_path = db_data.get('selected_template')
                
                if template_path:
                    terraform_dir = os.path.join(os.path.dirname(__file__), 'terraform')
                    
                    send_step_message("Initializing Terraform...", 10)
                    init_command = f'cd "{terraform_dir}" && terraform init'
                    subprocess.run(init_command, shell=True, check=True)

                    send_step_message("Applying Terraform configuration...", 30)
                    apply_command = f'cd "{terraform_dir}" && terraform apply -auto-approve'
                    subprocess.run(apply_command, shell=True, check=True)

                    send_step_message("Retrieving instance IP...", 80)
                    output_command = f'cd "{terraform_dir}" && terraform output -json instance_public_ip'
                    output_process = subprocess.run(output_command, shell=True, capture_output=True, text=True)
                    
                    if output_process.returncode == 0:
                        instance_ip = json.loads(output_process.stdout.strip())
                        deployed_url = f"http://{instance_ip}/templates/{template_path}"
                        send_step_message("Deployment completed successfully!", 100)
                        return jsonify({
                            "message": "Deployment successful",
                            "instance_ip": instance_ip,
                            "deployed_url": deployed_url
                        }), 200
                    else:
                        send_step_message("Failed to retrieve instance IP", 90)
                        return jsonify({"error": "Failed to retrieve instance IP", "stderr": output_process.stderr}), 500
                else:
                    return jsonify({"error": "No template selected"}), 400
        else:
            return jsonify({"error": "db.json not found"}), 500
    except subprocess.CalledProcessError as e:
        send_step_message(f"Deployment failed: {str(e)}", 100)
        return jsonify({"error": f"Deployment failed: {str(e)}"}), 500
    except Exception as e:
        send_step_message(f"Unexpected error: {str(e)}", 100)
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)