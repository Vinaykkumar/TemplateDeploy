// DeploymentSelector.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './css/DeploymentSelector.css';

const DeploymentSelector = () => {
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const history = useHistory();

  const deployments = [
    { id: 1, name: 'AWS' },
    { id: 2, name: 'Azure', disabled: true },
    { id: 3, name: 'GCP', disabled: true },
  ];

  const handleDeploymentChange = (e) => {
    setSelectedDeployment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDeployment) {
      history.push('/deploybutton');
    }
  };

  return (
    <div className="deployment-selector-container">
      <h1>Choose a Deployment Platform</h1>
      <form onSubmit={handleSubmit}>
        <select value={selectedDeployment} onChange={handleDeploymentChange}>
          <option value="">Select a deployment platform</option>
          {deployments.map((deployment) => (
            <option key={deployment.id} value={deployment.id} disabled={deployment.disabled}>
              {deployment.name} {deployment.disabled ? '(Coming soon)' : ''}
            </option>
          ))}
        </select>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default DeploymentSelector;