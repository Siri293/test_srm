import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const SessionModal = ({ isOpen, onClose, onSave, session, subjects }) => {
  const [formData, setFormData] = useState({
    subject_id: '',
    time_spent: '',
    topic: '',
    focus_level: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        subject_id: session.subject_id,
        time_spent: session.time_spent,
        topic: session.topic || '',
        focus_level: session.focus_level || '',
        notes: session.notes || ''
      });
    } else {
      setFormData({
        subject_id: subjects.length > 0 ? subjects[0].id : '',
        time_spent: '',
        topic: '',
        focus_level: '',
        notes: ''
      });
    }
  }, [session, subjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        subject_id: parseInt(formData.subject_id),
        time_spent: parseFloat(formData.time_spent),
        focus_level: formData.focus_level ? parseInt(formData.focus_level) : null
      };

      let response;
      if (session) {
        // Update existing session
        response = await axios.put(`/api/sessions/${session.id}`, submitData);
      } else {
        // Create new session
        response = await axios.post('/api/sessions/', submitData);
      }

      onSave(response.data.session);
      toast.success(session ? 'Session updated successfully' : 'Session logged successfully');
    } catch (error) {
      console.error('Failed to save session:', error);
      const message = error.response?.data?.error || 'Failed to save session';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {session ? 'Edit Study Session' : 'Log Study Session'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Subject Selection */}
                <div>
                  <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <select
                    id="subject_id"
                    name="subject_id"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.subject_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Spent */}
                <div>
                  <label htmlFor="time_spent" className="block text-sm font-medium text-gray-700">
                    Time Spent (hours) *
                  </label>
                  <input
                    type="number"
                    id="time_spent"
                    name="time_spent"
                    step="0.1"
                    min="0.1"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., 1.5"
                    value={formData.time_spent}
                    onChange={handleChange}
                  />
                </div>

                {/* Topic */}
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                    Topic (optional)
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., Calculus derivatives"
                    value={formData.topic}
                    onChange={handleChange}
                  />
                </div>

                {/* Focus Level */}
                <div>
                  <label htmlFor="focus_level" className="block text-sm font-medium text-gray-700">
                    Focus Level (1-10, optional)
                  </label>
                  <select
                    id="focus_level"
                    name="focus_level"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.focus_level}
                    onChange={handleChange}
                  >
                    <option value="">Select focus level</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} - {i + 1 <= 3 ? 'Low' : i + 1 <= 6 ? 'Medium' : i + 1 <= 8 ? 'High' : 'Excellent'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Any additional notes about this study session..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  session ? 'Update Session' : 'Log Session'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;