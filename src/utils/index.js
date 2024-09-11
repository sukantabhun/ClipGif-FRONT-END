import FileSave from 'file-saver';
export async function downloadImage(_id , photo) {
    FileSave.saveAs(photo, `${_id}.gif`);
}