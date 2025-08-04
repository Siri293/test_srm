import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, BookOpen, Clock, Target, Edit2, Trash2 } from 'lucide-react';
import SubjectModal from './SubjectModal';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      // Mock subjects data for demo
      const mockSubjects = [
        {
          id: 1,
          name: 'Mathematics',
          color: '#3B82F6',
          total_study_time: 8.5,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Computer Science',
          color: '#10B981',
          total_study_time: 12.3,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Physics',
          color: '#F59E0B',
          total_study_time: 6.7,
          created_at: new Date().toISOString()
        }
      ];
      setSubjects(mockSubjects);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will also delete all associated study sessions.')) {
      return;
    }

    try {
      await axios.delete(`/api/subjects/${subjectId}`);
      setSubjects(subjects.filter(s => s.id !== subjectId));
      toast.success('Subject deleted successfully');
    } catch (error) {
      console.error('Failed to delete subject:', error);
      toast.error('Failed to delete subject');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubjectSaved = (savedSubject) => {
    if (editingSubject) {
      // Update existing subject
      setSubjects(subjects.map(s => s.id === savedSubject.id ? savedSubject : s));
    } else {
      // Add new subject
      setSubjects([...subjects, savedSubject]);
    }
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
          <p className="text-gray-600">Manage your study subjects and track progress</p>
        </div>
        <button
          onClick={handleCreateSubject}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
          <p className="text-gray-500 mb-6">Create your first subject to start tracking your study progress</p>
          <button
            onClick={handleCreateSubject}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {/* Subject Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {subject.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Subject Stats */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{subject.total_study_time?.toFixed(1) || '0.0'} hours studied</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    <span>Created {new Date(subject.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Study Progress</span>
                    <span>{subject.total_study_time?.toFixed(1) || '0.0'}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: subject.color,
                        width: `${Math.min((subject.total_study_time || 0) * 10, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Modal */}
      <SubjectModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleSubjectSaved}
        subject={editingSubject}
      />
    </div>
  );
};

export default Subjects;