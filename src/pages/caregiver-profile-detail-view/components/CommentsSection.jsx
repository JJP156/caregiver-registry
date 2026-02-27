import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentsSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserColor = (userId) => {
    const colors = [
      'bg-primary', 'bg-success', 'bg-warning', 'bg-error', 
      'bg-accent', 'bg-secondary'
    ];
    return colors[userId % colors.length];
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="MessageSquare" size={20} className="mr-2 text-primary" />
        Comentarios Administrativos
        <span className="ml-2 px-2 py-1 bg-muted text-text-secondary text-sm rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} color="white" />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Agregar comentario interno..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={!newComment.trim() || isSubmitting}
                loading={isSubmitting}
              >
                <Icon name="Send" size={16} className="mr-2" />
                Comentar
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${getUserColor(comment.userId)}`}>
              {getUserInitials(comment.author)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-text-primary">
                    {comment.author}
                  </h4>
                  <span className="text-xs text-text-secondary">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {comment.content}
                </p>
                
                {comment.isPrivate && (
                  <div className="flex items-center mt-2 text-xs text-warning">
                    <Icon name="Lock" size={12} className="mr-1" />
                    Comentario privado
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="mx-auto text-text-secondary/50 mb-4" />
          <p className="text-text-secondary">No hay comentarios aún</p>
          <p className="text-sm text-text-secondary mt-1">
            Agrega el primer comentario administrativo
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;