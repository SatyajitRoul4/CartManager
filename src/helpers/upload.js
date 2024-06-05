import storage from '@react-native-firebase/storage';


export const uploadImage = async (selectedImage) => {
  try {
    if (!selectedImage || selectedImage.length === 0) {
      return '';
    }

    const uploadUri = selectedImage;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    task.on('state_changed', (taskSnapshot) => {
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });

    const uploadResult = await task;
    console.log('Image uploaded to the bucket!', uploadResult);

    const url = await storage().ref(`photos/${filename}`).getDownloadURL() || '';

    return url;
  } catch (err) {
    console.log('getting error while uploading to firebase', err);
    return '';
  }
};