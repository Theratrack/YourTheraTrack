import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { GuestFeedback } from './pages/GuestFeedback';
import { ThankYou } from './pages/ThankYou';
import { Dashboard } from './pages/Dashboard';
import { Alert } from './pages/Alert';
import { WeeklyReport } from './pages/WeeklyReport';
import { QRCodes } from './pages/QRCodes';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public — guests never need to log in */}
      <Route path="/" element={<Landing />} />
      <Route path="/feedback" element={<GuestFeedback />} />
      <Route path="/thanks" element={<ThankYou />} />
      <Route path="/login" element={<Login />} />

      {/* Staff-only */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <WeeklyReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr"
        element={
          <ProtectedRoute>
            <QRCodes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alert"
        element={
          <ProtectedRoute>
            <Alert />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alert/:id"
        element={
          <ProtectedRoute>
            <Alert />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
