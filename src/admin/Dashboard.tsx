import  { useContext } from 'react';
import { FaUserTie } from 'react-icons/fa';
import myContext from '@/Context/data/myContext';  // Ensure myContext is exported correctly
import Navbar from '@/components/ui/Navbar';
import Footer from '@/ecomovetest/Footer';
import DashboardTab from './DashboardTab';

const Dashboard: React.FC = () => {
  // Using useContext to get the context value
  const context = useContext(myContext);

  // Error handling if context is missing (not wrapped in the Provider)
  if (!context) {
    throw new Error("Dashboard must be used within a MyProvider.");
  }

  // Since there's only light mode, directly set the mode to 'light'

  // Light theme
  const ecoTheme = {
    backgroundColor: 'rgb(235, 250, 242)',  // Light background
    textColor: 'rgb(34, 94, 51)',  // Light text color
    cardBackground: 'white',  // Light card background
    borderColor: 'rgb(72, 173, 105)',  // Border color
    shadowColor: 'rgba(72, 173, 105, 0.5)',  // Light shadow color
  };

  return (
    <div>
      <Navbar />
      <section
        className="body-font mb-10"
        style={{
          paddingTop: '80px',  // Adjust this based on your Navbar height
          backgroundColor: ecoTheme.backgroundColor,
        }}
      >
        <div className="container px-5 mx-auto mb-10">
          <div className="flex flex-wrap -m-4 text-center">
            {[ 
              { label: 'Total Products', value: 10 },
              { label: 'Total Orders', value: 10 },
              { label: 'Total Users', value: 20 },
              { label: 'Total Revenue', value: '$5000' },
            ].map((item, index) => (
              <div key={index} className="p-4 md:w-1/4 sm:w-1/2 w-full">
                <div
                  className="border-2 px-4 py-6 rounded-xl hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: ecoTheme.cardBackground,
                    borderColor: ecoTheme.borderColor,
                    color: ecoTheme.textColor,
                    boxShadow: `inset 0 0 10px ${ecoTheme.shadowColor}`,
                  }}
                >
                  <div className="text-green-500 w-12 h-12 mb-3 inline-block mt-30">
                    <FaUserTie size={50} color={ecoTheme.borderColor} />
                  </div>
                  <h2
                    className="title-font font-bold text-3xl"
                    style={{ color: ecoTheme.textColor }}
                  >
                    {item.value}
                  </h2>
                  <p
                    className="font-bold text-lg"
                    style={{ color: ecoTheme.textColor }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DashboardTab />
        <Footer />
      </section>
    </div>
  );
};

export default Dashboard;

