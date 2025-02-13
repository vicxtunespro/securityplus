// data.js
export const SecurityCompanyData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
    ],
    datasets: [
      {
        label: 'Incidents Reported',
        data: [30, 45, 25, 50, 40, 60], // Number of incidents reported each month
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Response Time (minutes)',
        data: [15, 20, 18, 25, 22, 30], // Average response time each month
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Customer Satisfaction (%)',
        data: [85, 80, 90, 75, 88, 92], // Customer satisfaction ratings each month
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };