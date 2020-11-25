import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const data = {
  labels: ['Matematiikka', 'Biologia', 'Historia', 'Yhteenlasku', '2. Maailmansota', 'Äidinkieli', 'Englanti'],
  datasets: [
    {
      label: 'Oikein',
      backgroundColor: 'rgba(99,255,132,0.2)',
      borderColor: 'rgba(99,255,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(99,255,132,0.4)',
      hoverBorderColor: 'rgba(99,255,132,1)',
      data: [65, 3, 20, 81, 56, 55, 40]
    },
    {
      label: 'Väärin',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [20, 59, 40, 2, 56, 55, 40]
    }
  ]
};

const pieData = {
  labels: ['Matematiikka', 'Biologia', 'Historia', 'Yhteenlasku', '2. Maailmansota', 'Äidinkieli', 'Englanti'
  ],
  datasets: [{
    data: [20, 59, 40, 2, 56, 55, 40],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#36A2EB'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#36A2EB'
    ]
  }]
};

function SubjectChart() {

  return (
    <div>
      <div>
        <h2>Pylväsdiagrammi esimerkki</h2>
        <Bar
          data={data}
          width={100}
          height={50}
          options={{
            scales: {
              xAxes: [{
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }}
        />
      </div>
      <div>
        <h2>Väärien vastauksien määrä</h2>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

export default SubjectChart