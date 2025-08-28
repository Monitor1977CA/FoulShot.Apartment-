import React from 'react';
import { DocumentContent } from '../../../types';
import ModalWrapper from './ModalWrapper';

const DocumentViewerModal: React.FC<DocumentContent> = (props) => {
  return (
    <ModalWrapper title={props.title}>
      <div className="bg-brand-bg p-6 rounded-lg border border-brand-border font-mono text-base leading-relaxed text-gray-300 whitespace-pre-wrap">
        {props.sender && <p><span className="font-bold text-gray-500">FROM:</span> {props.sender}</p>}
        {props.recipient && <p><span className="font-bold text-gray-500">TO:</span> {props.recipient}</p>}
        {props.date && <p><span className="font-bold text-gray-500">DATE:</span> {props.date}</p>}
        {props.subject && <p><span className="font-bold text-gray-500">SUBJECT:</span> {props.subject}</p>}
        {(props.sender || props.recipient || props.date || props.subject) && <hr className="my-4 border-brand-border" />}
        <p>{props.body}</p>
      </div>
    </ModalWrapper>
  );
};

export default DocumentViewerModal;
