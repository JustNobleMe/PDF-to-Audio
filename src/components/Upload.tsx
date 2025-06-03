import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `
//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js
`;

interface UploadPDFProps {
    onExtractText: (text: string) => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ onExtractText }) => {
    interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {}

    interface PDFTextItem {
        str: string;
    }

    const handleFile = async (e: FileInputEvent): Promise<void> => {
        const file: File = e.target.files![0];
        const reader = new FileReader();

        reader.onload = async (): Promise<void> => {
            const typedArray = new Uint8Array(reader.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += (content.items as PDFTextItem[]).map(item => item.str).join(" ");
                if (i < pdf.numPages) text += "\f"; // Use form feed as page separator
            }

            onExtractText(text);
        };
        reader.readAsArrayBuffer(file);
    };
    return <input type='file' accept='application/pdf' onChange={handleFile} />
};

export default UploadPDF;