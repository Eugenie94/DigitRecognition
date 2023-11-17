import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import './Body.css';
 
const Body = () => {
  const [prediction, setPrediction] = useState(null);
  const canvasRef = useRef(null);
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawing.current = false;
        setPrediction(null);
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
 
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawing.current = false;
    setPrediction(null);
  };
 
  const ImageTransmission = (image) => {
    let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([28, 28]).mean(2).expandDims(2).expandDims().toFloat();
    return tensor.div(255.0);
  };
 
  const Prediction = async (image) => {
    let tensor = ImageTransmission(image);
 
    try {
      let model = await tf.loadLayersModel('http://localhost:3001/predict/model.json');
 
      const predictions = await model.predict(tensor).data();
 
      model.dispose();
 
      const updatedPrediction = displayLabel(predictions);
 
      setPrediction(updatedPrediction);
 
      return updatedPrediction;
    } catch (error) {
      console.error('Erreur lors de la prédiction :', error);
      return null;
    }
  };
 
  const displayLabel = (data) => {
    let max = data[0];
    let maxIndex = 0;
 
    for (let i = 1; i < data.length; i++) {
      if (data[i] > max) {
        maxIndex = i;
        max = data[i];
      }
    }
 
    return {
      index: maxIndex,
      confidence: (max * 100).toFixed(2),
    };
  };
 
  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();
 
    const image = new Image();
    image.src = drawingData;
 
    image.onload = async () => {
      const canvasForModel = document.createElement('canvas');
      const contextForModel = canvasForModel.getContext('2d');
      canvasForModel.width = 28;
      canvasForModel.height = 28;
      contextForModel.drawImage(image, 0, 0, 28, 28);
 
      const imageData = contextForModel.getImageData(0, 0, 28, 28);
      const pixelData = imageData.data;
 
      const pixelValues = [];
      for (let i = 0; i < pixelData.length; i += 4) {
        const pixelValue = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
        pixelValues.push(pixelValue);
      }
 
      try {
        const updatedPrediction = await Prediction(canvas);
 
        const response = await fetch('http://localhost:3001/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pixels: pixelValues,
            prediction: updatedPrediction.index,
          }),
        });
 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
        const data = await response.json();
        console.log('Dessin enregistré avec succès :', data);
      } catch (error) {
        console.error('Erreur lors de l enregistrement du dessin :', error);
      }
    };
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
          <button className='rest' onClick={clearCanvas}>Reset</button>
        </div>
        <div className="manuscrit-column">
          <h1 className="saisie">Prédiction</h1>
          <canvas
            className="manuscrit-canvas"
            width={500}
            height={300}
            onClick={() => saveDrawing()}
          ></canvas>
          <button className='predire' onClick={saveDrawing}>Prédire</button>
          {prediction !== null && (
            <>
              <h1 id="result">{prediction.index}</h1>
              <p id="confidence">Confidence: {prediction.confidence}%</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Body;