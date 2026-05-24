import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { GuestFeedback } from './pages/GuestFeedback';
import { ThankYou } from './pages/ThankYou';
import { Dashboard } from './pages/Dashboard';
import { Alert } from './pages/Alert';
import { WeeklyReport } from './pages/WeeklyReport';
import { QRCodes } from './pages/QRCodes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feedback" element={<GuestFeedback />} />
      <Route path="/thanks" element={<ThankYou />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/alert" element={<Alert />} />
      <Route path="/alert/:id" element={<Alert />} />
      <Route path="/report" element={<WeeklyReport />} />
      <Route path="/qr" element={<QRCodes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
