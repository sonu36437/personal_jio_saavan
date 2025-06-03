import crypto from 'node-forge'

export const createDownloadLinks = (encryptedMediaUrl) => {
  if (!encryptedMediaUrl) return []

  const qualities = [
    { id: '_12', bitrate: '12kbps' },
    { id: '_48', bitrate: '48kbps' },
    { id: '_96', bitrate: '96kbps' },
    { id: '_160', bitrate: '160kbps' },
    { id: '_320', bitrate: '320kbps' }
  ]

  const key = '38346591'
  const iv = '00000000'

  const encrypted = crypto.util.decode64((encryptedMediaUrl))

  // const encrypted = encodeURIComponent(crypto.util.decode64(encryptedMediaUrl));
  // console.log(encrypted);
  
  const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(key))

  
  decipher.start({ iv: crypto.util.createBuffer(iv) })
  decipher.update(crypto.util.createBuffer(encrypted))
  decipher.finish()
  const decryptedLink = decipher.output.getBytes()
  console.log(decryptedLink);
  

  return qualities.map((quality) => ({
    quality: quality.bitrate,
    url: decryptedLink.replace('_96', quality.id)
  }))
}

