import type { AnalysisResult } from '@/types/ai-coach'

export class UploadQueue {
  private queue: Array<{ blob: Blob; metadata: any }> = []
  private processing = false
  private listeners: Array<(progress: number) => void> = []

  async add(blob: Blob, metadata: any): Promise<AnalysisResult> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        blob,
        metadata: { ...metadata, resolve, reject }
      })
      if (!this.processing) {
        this.process()
      }
    })
  }

  onProgress(callback: (progress: number) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notifyProgress(progress: number) {
    this.listeners.forEach(listener => listener(progress))
  }

  private async process() {
    this.processing = true
    while (this.queue.length > 0) {
      const item = this.queue.shift()
      if (item) {
        try {
          const result = await this.upload(item.blob, item.metadata)
          item.metadata.resolve(result)
        } catch (error) {
          item.metadata.reject(error)
        }
      }
    }
    this.processing = false
  }

  private async upload(blob: Blob, metadata: any): Promise<AnalysisResult> {
    const fd = new FormData()
    fd.append("file", blob, `${metadata.exercise}-session.webm`)
    fd.append("exercise", metadata.exercise)
    fd.append("reps", metadata.reps?.toString() || '0')

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          this.notifyProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText)
            resolve(result)
          } catch (err) {
            reject(new Error('Erro ao processar resposta'))
          }
        } else {
          reject(new Error(`Erro HTTP: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Erro de rede'))
      })

      xhr.open('POST', '/api/analyze')
      xhr.send(fd)
    })
  }
}

export const uploadQueue = new UploadQueue()

export async function compressVideo(blob: Blob, quality: number = 0.7): Promise<Blob> {
  // Por enquanto retorna o blob original
  // Pode ser expandido com compressão real usando canvas/ffmpeg.wasm
  return blob
}

export function handleRecordingError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('permission') || error.message.includes('NotAllowedError')) {
      return '❌ Não foi possível acessar a câmera. Verifique as permissões.'
    }
    if (error.message.includes('NotFoundError')) {
      return '❌ Nenhuma câmera encontrada no dispositivo.'
    }
    if (error.message.includes('gravação')) {
      return '❌ Falha na gravação. Tente novamente.'
    }
    if (error.message.includes('upload') || error.message.includes('rede')) {
      return '❌ Falha no upload. Verifique sua conexão.'
    }
  }
  return '❌ Erro desconhecido. Tente novamente.'
}

export function downloadVideo(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
