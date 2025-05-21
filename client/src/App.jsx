import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [pointMap, setPointMap] = useState({}); // { "x_y": count }
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set initial canvas background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const handleMouseMove = async (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const key = `${x}_${y}`;

      // Update hit count
      setPointMap(prev => {
        const newMap = { ...prev };
        newMap[key] = (newMap[key] || 0) + 1;

        // Draw pixel with a glowing effect
        const intensity = Math.min(255, newMap[key] * 20);
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgb(${intensity}, ${Math.floor(intensity/2)}, 255)`;
        ctx.fillStyle = `rgb(${intensity}, ${Math.floor(intensity/2)}, 255)`;
        ctx.fillRect(x, y, 2, 2);
        ctx.shadowBlur = 0;

        setTotalPoints(prev => prev + 1);
        
        axios.post('http://localhost:5000/api/points', { x, y });

        return newMap;
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Interactive Heat Map Canvas</h1>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="canvas"
        />
      </div>
      <p className="description">
        Move your mouse across the canvas to create a beautiful heat map pattern. 
        Total points tracked: {totalPoints}
      </p>
    </div>
  );
}

export default App;
