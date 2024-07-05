import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './css/DeployButton.css';

const DeployButton = () => {
  const [deploymentStatus, setDeploymentStatus] = useState("");
  const [deployedUrl, setDeployedUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('deployment_status', (data) => {
      setDeploymentStatus(data.message);
      setProgress(data.progress);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDeploy = async () => {
    try {
      setDeploymentStatus('Initiating deployment...');
      setProgress(0);

      const deployResponse = await axios.post('http://localhost:5000/api/terraform/deploy');

      if (deployResponse.status === 200) {
        setDeployedUrl(deployResponse.data.deployed_url);
      } else {
        throw new Error('Failed to deploy template.');
      }
    } catch (error) {
      console.error('Error deploying template:', error);
      setDeploymentStatus('Failed to initiate deployment.');
    }
  };

  return (
    <div className="deploy-button-container">
      <h3>Deploy Template</h3>
      <button onClick={handleDeploy}>Deploy</button>
      {deploymentStatus && <p>{deploymentStatus}</p>}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      {deployedUrl && (
        <div>
          <p>Deployment successful! You can view your template <a href={deployedUrl} target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      )}
    </div>
  );
};

export default DeployButton;