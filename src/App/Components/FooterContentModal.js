import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import './HeaderContentModal.css';
import { X, ChevronDown, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon } from 'lucide-react';

const FooterContentModal = ({ isOpen, onClose, initialContent = '', onSave, onPreview }) => {
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  // Update editor content when modal opens or initialContent changes
  useEffect(() => {
    if (editor && isOpen) {
      editor.commands.setContent(initialContent || '');
    }
  }, [editor, isOpen, initialContent]);

  if (!isOpen) return null;

  // Placeholder groups for footer
  const placeholderGroups = {
    'Basic': [
      { label: 'Company Name', value: '{companyName}' },
      { label: 'Current Date', value: '{currentDate}' },
      { label: 'Quote Number', value: '{quoteNumber}' },
      { label: 'Quote Title', value: '{quoteTitle}' }
    ],
    'Customer Details': [
      { label: 'Customer Name', value: '{customerName}' },
      { label: 'Customer Address', value: '{customerAddress}' },
      { label: 'Customer Email', value: '{customerEmail}' },
      { label: 'Customer Phone', value: '{customerPhone}' }
    ],
    'Quote Details': [
      { label: 'Quote Date', value: '{quoteDate}' },
      { label: 'Expiry Date', value: '{expiryDate}' },
      { label: 'Reference Number', value: '{referenceNumber}' },
      { label: 'Sales Person', value: '{salesPerson}' },
      { label: 'VAT Number', value: '{vatNumber}' }
    ],
    'Page Numbers': [
      { label: 'Current Page', value: '{currentPage}' },
      { label: 'Total Pages', value: '{totalPages}' },
      { label: 'Page X of Y', value: 'Page {currentPage} of {totalPages}' }
    ],
    'Custom Fields': [
      { label: 'Custom Field 1', value: '{customField1}' },
      { label: 'Custom Field 2', value: '{customField2}' },
      { label: 'Custom Field 3', value: '{customField3}' }
    ]
  };

  // Insert placeholder at cursor position
  const insertPlaceholder = (placeholder) => {
    if (editor) {
      editor.chain().focus().insertContent(placeholder).run();
    }
    setShowPlaceholders(false);
  };

  const handleClearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      editor?.commands.setContent('');
    }
  };

  const handlePreview = () => {
    if (onPreview && editor) {
      onPreview(editor.getHTML());
    }
    // Close modal so user can see the preview in PDF viewer
    onClose();
  };

  const handleSave = () => {
    if (onSave && editor) {
      onSave(editor.getHTML());
    }
    onClose();
  };

  // Auto-save content when closing modal
  const handleClose = () => {
    if (onSave && editor) {
      onSave(editor.getHTML());
    }
    onClose();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Customise your footer content</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Custom Toolbar */}
          <div className="flex items-center gap-1 mb-2 pb-2 border-b border-gray-200 flex-wrap">
            {/* Text Formatting */}
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('strike') ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Font Size */}
            <select
              onChange={(e) => {
                const level = parseInt(e.target.value);
                if (level === 0) {
                  editor?.chain().focus().setParagraph().run();
                } else {
                  editor?.chain().focus().toggleHeading({ level }).run();
                }
              }}
              className="p-1 border border-gray-300 rounded text-sm"
              value={
                editor?.isActive('heading', { level: 1 }) ? '1' :
                editor?.isActive('heading', { level: 2 }) ? '2' :
                editor?.isActive('heading', { level: 3 }) ? '3' :
                '0'
              }
            >
              <option value="0">16px (Normal)</option>
              <option value="3">18px (H3)</option>
              <option value="2">24px (H2)</option>
              <option value="1">32px (H1)</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Alignment */}
            <button
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Link */}
            <button
              onClick={setLink}
              className={`p-2 hover:bg-gray-100 rounded ${editor?.isActive('link') ? 'bg-blue-100 text-blue-600' : ''}`}
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <div className="flex-1"></div>

            {/* Insert Placeholders Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPlaceholders(!showPlaceholders)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Insert Placeholders
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPlaceholders && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
                  {Object.entries(placeholderGroups).map(([groupName, placeholders]) => (
                    <div key={groupName} className="border-b border-gray-200 last:border-b-0">
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
                        {groupName}
                      </div>
                      {placeholders.map((placeholder) => (
                        <button
                          key={placeholder.value}
                          onClick={() => insertPlaceholder(placeholder.value)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium text-gray-800">{placeholder.label}</div>
                          <div className="text-xs text-gray-500">{placeholder.value}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <EditorContent editor={editor} />
          </div>

          {/* Note */}
          <p className="mt-3 text-xs text-gray-500">
            Note: If your content exceeds the template margin, you can adjust the margin values accordingly.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              title="Close without saving changes"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={handleClearContent}
            className="px-4 py-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          >
            Clear Content
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default FooterContentModal;
