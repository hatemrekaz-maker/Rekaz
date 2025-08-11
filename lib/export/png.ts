import html2canvas from 'html2canvas';
export async function savePng(elementId: string) {
  const el = document.getElementById(elementId) || document.body;
  const canvas = await html2canvas(el);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'snapshot.png'; a.click();
    URL.revokeObjectURL(url);
  });
}
