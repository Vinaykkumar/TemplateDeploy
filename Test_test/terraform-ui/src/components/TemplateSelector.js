// TemplateSelector.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './css/TemplateSelector.css';

const TemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const history = useHistory();

  const templates = [
    { id: 1, name: 'Template 1', file: 'Template1.html' },
    { id: 2, name: 'Template 2', file: 'Template2.html' },
    { id: 3, name: 'Template 3', file: 'Template3.html' },
    { id: 4, name: 'Template 4', file: 'Template4.html' },
    { id: 5, name: 'Template 5', file: 'Template5.html' },
  ];

  const handleTemplateChange = (e) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTemplate) {
      const selectedTemplateObj = templates.find(template => template.id === parseInt(selectedTemplate));
      try {
        await axios.post('http://localhost:5000/api/save-template', { template: selectedTemplateObj.file });
        history.push('/database');
      } catch (error) {
        console.error('Error saving template:', error);
      }
    }
  };

  return (
    <div className="template-selector-container">
      <h1>Select a Template</h1>
      <form onSubmit={handleSubmit}>
        <select value={selectedTemplate} onChange={handleTemplateChange}>
          <option value="">Select a template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default TemplateSelector;