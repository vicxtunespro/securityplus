'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import useModalStore from '@/store/modalStore';
import AddWeaponModal from '@/components/Data Models/addWeapon';
import Modal from '@/components/Data Models/modal';
import { Filter, Plus, Shield, Crosshair, CheckCircle, XCircle } from 'lucide-react';
import { db } from '@/libs/firebase'; // Import Firestore instance
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore methods

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function WeaponsDashboard() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModalStore();
  const pathname = usePathname();

  useEffect(() => {
    // Real-time listener for Firestore collection
    const unsubscribe = onSnapshot(
      collection(db, 'weapons'), // Replace 'weapons' with your Firestore collection name
      (snapshot) => {
        const weaponsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWeapons(weaponsData);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to fetch weapons in real-time:', error);
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Calculate metrics
  const totalWeapons = weapons.length;
  const assignedWeapons = weapons.filter(w => w.status === 'assigned').length;
  const availableWeapons = weapons.filter(w => w.status === 'available').length;
  const maintenanceWeapons = weapons.filter(w => w.status === 'maintenance').length;
  
  // Group by weapon type
  const typeCounts = weapons.reduce((acc, weapon) => {
    acc[weapon.type] = (acc[weapon.type] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const statusChartData = {
    labels: ['Assigned', 'Available', 'Maintenance'],
    datasets: [
      {
        label: 'Weapons by Status',
        data: [assignedWeapons, availableWeapons, maintenanceWeapons],
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',  // Assigned (indigo)
          'rgba(16, 185, 129, 0.7)', // Available (emerald)
          'rgba(245, 158, 11, 0.7)'  // Maintenance (amber)
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const typeChartData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'Weapons by Type',
        data: Object.values(typeCounts),
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(244, 63, 94, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(22, 163, 74, 0.7)',
          'rgba(220, 38, 38, 0.7)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(220, 38, 38, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleOpenModal = () => {
    openModal(<AddWeaponModal />);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-4 md:px-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Weapons</p>
              <h3 className="text-2xl font-bold mt-1">{totalWeapons}</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Assigned</p>
              <h3 className="text-2xl font-bold mt-1">{assignedWeapons}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <Crosshair className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Available</p>
              <h3 className="text-2xl font-bold mt-1">{availableWeapons}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Maintenance</p>
              <h3 className="text-2xl font-bold mt-1">{maintenanceWeapons}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h4 className="text-lg font-semibold mb-4">Weapons by Status</h4>
          <div className="h-64">
            <Pie 
              data={statusChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h4 className="text-lg font-semibold mb-4">Weapons by Type</h4>
          <div className="h-64">
            <Bar
              data={typeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity or Additional Metrics */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mt-6">
        <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-4">
          {weapons.slice(0, 5).map((weapon, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0">
              <div>
                <p className="font-medium">{weapon.name}</p>
                <p className="text-sm text-gray-500">{weapon.type} • {weapon.serial}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                weapon.status === 'Assigned' ? 'bg-indigo-100 text-indigo-800' :
                weapon.status === 'Available' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {weapon.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <Modal />
    </div>
  );
}