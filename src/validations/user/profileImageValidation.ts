
export async function validateProfileImage(file: File): Promise<{ valid: boolean; message?: string }> {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!file.type || !allowedTypes.includes(file.type.toLowerCase())) {
    return { valid: false, message: "Tipo de archivo no permitido. Solo JPG, PNG, GIF son aceptados para fotos de perfil." };
  }
  const originalFilename = file.name;
  const validExtensions = /\.(jpg|jpeg|png|gif)$/i;
  if (!originalFilename || !validExtensions.test(originalFilename)) {
    return { valid: false, message: "El archivo debe tener una extensión válida: JPG, JPEG, PNG o GIF." };
  }
  const extensionCount = (originalFilename.match(/\./g) || []).length;
  if (extensionCount > 1) {
    return { valid: false, message: "El nombre del archivo no puede tener múltiples extensiones." };
  }
  if (originalFilename.includes("..") || originalFilename.includes("/") || originalFilename.includes("\\")) {
    return { valid: false, message: "Nombre de archivo contiene caracteres no permitidos." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, message: "El archivo excede el tamaño máximo permitido (5MB)." };
  }
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("El archivo no es una imagen válida."));
      image.src = imageUrl;
    });
    const width = img.width;
    const height = img.height;
    URL.revokeObjectURL(imageUrl);
    if (width < 100 || height < 100) {
      return { valid: false, message: "La imagen es demasiado pequeña (mínimo 100x100 píxeles)." };
    }
    if (width > 3000 || height > 3000) {
      return { valid: false, message: "Dimensiones de la imagen excesivas (máximo 3000x3000 píxeles)." };
    }
  } catch {
    return { valid: false, message: "El archivo no es una imagen válida." };
  }
  return { valid: true };
}