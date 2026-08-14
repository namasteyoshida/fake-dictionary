import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { notificationModalAtom } from '../store/game';

export const NotificationModal: React.FC = () => {
  const [modal, setModal] = useAtom(notificationModalAtom);
  const navigate = useNavigate();

  if (!modal.isOpen) return null;

  const handleClose = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    navigate('/');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-card__stamp">通 知</div>
        <h3 id="modal-title" className="modal-card__title">
          {modal.title}
        </h3>
        <p className="modal-card__message">{modal.message}</p>
        <button type="button" className="btn btn-primary modal-card__btn" onClick={handleClose}>
          {modal.buttonText || 'タイトル画面へ戻る'}
        </button>
      </div>
    </div>
  );
};
