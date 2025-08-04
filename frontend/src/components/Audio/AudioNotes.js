import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mic, Play, Pause, Trash2, Edit2, Plus } from 'lucide-react';

const AudioNotes = () => {
  const [audioNotes, setAudioNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    fetchAudioNotes();
  }, []);

  const fetchAudioNotes = async () => {
    try {
      const response = await axios.get('/api/audio/');
      setAudioNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch audio notes:', error);
      toast.error('Failed to load audio notes');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      toast.success('Recording stopped');
    }
  };

  const saveRecording = async () => {
    if (audioChunks.length === 0) {
      toast.error('No recording to save');
      return;
    }

    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('duration', '0'); // You might want to calculate actual duration
      formData.append('transcript', ''); // Add transcript if available

      const response = await axios.post('/api/audio/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAudioNotes([response.data.audio_note, ...audioNotes]);
      setAudioChunks([]);
      toast.success('Recording saved successfully');
    } catch (error) {
      console.error('Failed to save recording:', error);
      toast.error('Failed to save recording');
    }
  };

  const deleteAudioNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this audio note?')) {
      return;
    }

    try {
      await axios.delete(`/api/audio/${noteId}`);
      setAudioNotes(audioNotes.filter(note => note.id !== noteId));
      toast.success('Audio note deleted successfully');
    } catch (error) {
      console.error('Failed to delete audio note:', error);
      toast.error('Failed to delete audio note');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Audio Notes</h2>
          <p className="text-gray-600">Record voice reflections and study notes</p>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center space-x-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Recording
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-red-600">
                <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                <span className="font-medium">Recording...</span>
              </div>
              <button
                onClick={stopRecording}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Stop Recording
              </button>
            </div>
          )}
          
          {audioChunks.length > 0 && !recording && (
            <button
              onClick={saveRecording}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Save Recording
            </button>
          )}
        </div>
      </div>

      {/* Audio Notes List */}
      {audioNotes.length === 0 ? (
        <div className="text-center py-12">
          <Mic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audio notes yet</h3>
          <p className="text-gray-500 mb-6">Start recording your first voice reflection</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {audioNotes.map((note) => (
              <div key={note.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Mic className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Audio Note #{note.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(note.timestamp)} • {formatDuration(note.duration)}
                        </p>
                      </div>
                    </div>
                    
                    {note.transcript && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{note.transcript}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {note.audio_url && (
                      <button
                        onClick={() => {
                          // Simple audio playback - in a real app, you'd want more sophisticated controls
                          const audio = new Audio(note.audio_url);
                          if (playingId === note.id) {
                            audio.pause();
                            setPlayingId(null);
                          } else {
                            audio.play();
                            setPlayingId(note.id);
                            audio.onended = () => setPlayingId(null);
                          }
                        }}
                        className="text-gray-400 hover:text-primary-600 p-2"
                      >
                        {playingId === note.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteAudioNote(note.id)}
                      className="text-gray-400 hover:text-red-600 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioNotes;