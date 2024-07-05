provider "aws" {
  region = "us-east-2"
}

variable "template" {
  type    = string
  default = "default_template"
}

variable "template_content" {
  type    = string
  default = "Default template content"
}

resource "aws_instance" "web" {
  ami           = "ami-09040d770ffe2224f"
  instance_type = "t2.micro"
  key_name      = "low_code_test"

  vpc_security_group_ids = ["sg-0cb1fb26417af04a1"]

  tags = {
    Name = "Low_Code"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt update -y
              sudo apt install -y nginx
              sudo systemctl start nginx
              sudo systemctl enable nginx
              sudo mkdir -p /var/www/html/templates
              EOF
}

resource "null_resource" "provision" {
  depends_on = [aws_instance.web]

  provisioner "local-exec" {
    command = "sleep 60"  # Adjust the sleep time as needed to ensure the instance is ready
  }

  provisioner "file" {
    source      = "${path.module}/../../terraform-ui/src/templates/"
    destination = "/tmp/"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/low_code_test.pem")
      host        = aws_instance.web.public_ip
      timeout     = "5m"
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mv /tmp/*.html /var/www/html/templates/",
      "sudo chown -R www-data:www-data /var/www/html/templates",
      "sudo chmod -R 644 /var/www/html/templates/*.html",
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/low_code_test.pem")
      host        = aws_instance.web.public_ip
      timeout     = "5m"
    }
  }
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}