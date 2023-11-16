import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Body.css';

export default function Body() {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const hasDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let isDrawing = false;

    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }

    function stopDrawing() {
      isDrawing = false;
      context.beginPath();
      hasDrawing.current = true;
    }

    function draw(e) {
      if (!isDrawing) return;

      const mouseX = e.clientX - context.canvas.offsetLeft;
      const mouseY = e.clientY - context.canvas.offsetTop;

      context.lineWidth = 30;
      context.lineCap = 'round';
      context.strokeStyle = '#000';

      context.lineTo(mouseX, mouseY);
      context.stroke();
      context.beginPath();
      context.moveTo(mouseX, mouseY);
    }

    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'z') {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    const addEventListeners = () => {
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mousemove', draw);
      window.addEventListener('keydown', handleKeyDown);
    };

    const removeEventListeners = () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', draw);
      window.removeEventListener('keydown', handleKeyDown);
    };

    addEventListeners();

    return () => {
      removeEventListeners();
    };
  }, [canvasRef]);
  
  const saveDrawing = async () => {
    if (hasDrawing.current) {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL('image/png');
  
      try {
        // Envoyer l'image à l'API avec Axios
        const response = await axios.post('http://localhost:3001/api/images', { image });
        
        // Assurez-vous que la structure de réponse de l'API est correcte
        const predictedDigit = response.data.prediction;
        
        // Mettre à jour l'état avec la prédiction
        setPrediction(predictedDigit);
        console.log('Prédiction réussie :', predictedDigit);
      } catch (error) {
        console.error('Erreur lors de la prédiction :', error);
      }
    }
  };
  

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawing.current = false;
    setPrediction(null); 
  };


  return (
    <div className="zone-manuscrit">
      <div className="manuscrit-card">
        <div className="manuscrit-column">
          <h1 className="saisie">OCR manuscrit</h1>
          <canvas
            className="manuscrit-canvas"
            width={500}
            height={300}
            ref={canvasRef}
          ></canvas>
          <button className='rest' onClick={resetCanvas}>Reset</button>
        </div>
        <div className="manuscrit-column">
          <h1 className="saisie">Prédiction</h1>
          <canvas
            className="manuscrit-canvas"
            width={500}
            height={300}
          ></canvas>
          <button className='predire' onClick={saveDrawing}>Prédire</button>
          
          {prediction !== null && (
            <p>Résultat de la prédiction : {prediction}</p>
          )}

        </div>
      </div>
    </div>
  );
}
