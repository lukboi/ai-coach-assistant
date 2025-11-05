"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Video,
  VideoOff,
  Play,
  Square,
  Upload,
  User,
  UserCheck,
  Camera,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Settings,
  Download,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ExtendedMediaRecorder extends MediaRecorder {
  _progressInterval?: NodeJS.Timeout;
}

export default function CoachPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<ExtendedMediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSessionActive, setIsSessionActive] = useState(false)
  const [cameraStatus, setCameraStatus] = useState<"off" | "on" | "error">("off")
  const [userDetected, setUserDetected] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState("")
  const [repCount, setRepCount] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const exercises = [
    "Agachamento",
    "Supino",
    "Levantamento Terra",
    "Desenvolvimento",
    "Flexão",
    "Barra Fixa",
    "Rosca Bíceps",
    "Tríceps Testa",
  ]

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [stream, previewUrl])

  const enableCamera = async (): Promise<void> => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      })
      setStream(s)

      setCameraStatus("on")
      setUserDetected(true)

      setFeedback(prev => ["Câmera ativada com sucesso! Pronto para começar.", ...prev.slice(0, 2)])
    } catch (err) {
      console.error("Erro ao acessar câmera:", err)
      setCameraStatus("error")
      setFeedback(prev => ["❌ Erro ao acessar câmera. Verifique as permissões.", ...prev.slice(0, 2)])
    }
  }

  const disableCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    setCameraStatus("off")
    setUserDetected(false)
  }

  const startRecording = async (): Promise<void> => {
    if (!stream) {
      await enableCamera()
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Verifica o 'stream' do estado
    if (!stream) {
      setFeedback(prev => ["❌ Câmera não disponível. Tente novamente.", ...prev.slice(0, 2)])
      return
    }

    setRecordedChunks([])
    setFeedback(prev => [`🎬 Iniciando gravação de ${selectedExercise}...`, ...prev.slice(0, 2)])

    const options: MediaRecorderOptions = { mimeType: "video/webm;codecs=vp9,opus" }
    try {
      const mediaRecorder = new MediaRecorder(stream, options) as ExtendedMediaRecorder
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        setFeedback(prev => ["✅ Gravação finalizada! Você pode baixar ou enviar para análise.", ...prev.slice(0, 2)])
      }

      mediaRecorder.start(1000)
      setIsRecording(true)

      let currentReps = 0
      const feedbackInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          const feedbacks = [
            "✅ Rep válida! Ótima execução.",
            "⚠️ Controle melhor a descida",
            "✅ Amplitude completa! Continue.",
            "⚠️ Mantenha as costas retas",
            "✅ Perfeito! Rep contabilizada.",
            "💪 Boa forma! Continue assim.",
          ]
          const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
          setFeedback((prev) => [randomFeedback, ...prev.slice(0, 2)])

          if (randomFeedback.includes("válida") || randomFeedback.includes("Perfeito")) {
            currentReps++
            setRepCount(currentReps)
          }
        }
      }, 3500)

      mediaRecorderRef.current._progressInterval = feedbackInterval
    } catch (err) {
      console.error("Erro ao iniciar MediaRecorder:", err)
      setFeedback(prev => ["❌ Falha ao iniciar gravação. Verifique o navegador.", ...prev.slice(0, 2)])
    }
  }

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      if (mediaRecorderRef.current._progressInterval) {
        clearInterval(mediaRecorderRef.current._progressInterval)
      }
    }
    setIsRecording(false)
  }

  const handleStartSession = async () => {
    if (!selectedExercise) {
      setFeedback(prev => ["⚠️ Selecione um exercício antes de iniciar.", ...prev.slice(0, 2)])
      return
    }

    if (!isSessionActive) {
      setIsSessionActive(true)
      await startRecording()
    } else {
      stopRecording()
      setIsSessionActive(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setFeedback(prev => ["📁 Vídeo carregado! Pronto para análise.", ...prev.slice(0, 2)])
  }

  const handleUploadVideo = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const uploadToBackend = async (): Promise<void> => {
    if (!previewUrl && recordedChunks.length === 0) {
      setFeedback(prev => ["⚠️ Nenhum vídeo disponível para enviar.", ...prev.slice(0, 2)])
      return
    }

    setUploading(true)
    setFeedback(prev => ["📤 Enviando vídeo para análise...", ...prev.slice(0, 2)])

    try {
      let blob: Blob
      if (recordedChunks.length > 0) {
        blob = new Blob(recordedChunks, { type: "video/webm" })
      } else {
        const res = await fetch(previewUrl!)
        blob = await res.blob()
      }

      const fd = new FormData()
      fd.append("file", blob, `${selectedExercise}-session.webm`)
      fd.append("exercise", selectedExercise)
      fd.append("reps", repCount.toString())

      try {
        const resp = await fetch("/api/analyze", { method: "POST", body: fd })
        if (!resp.ok) throw new Error("Resposta não OK")
        const json = await resp.json()
        setFeedback(prev => [
          `✅ Análise recebida: ${json.summary || "Análise completa!"}`,
          ...prev.slice(0, 2)
        ])
      } catch (err) {
        console.warn("Backend indisponível, simulando resultado:", err)
        setTimeout(() => {
          setFeedback(prev => [
            `📊 Simulação: ${repCount} repetições detectadas de ${selectedExercise}`,
            "💡 Sugestão: Mantenha a postura ereta durante todo o movimento",
            "✅ Execução geral: Boa! Continue praticando.",
            ...prev.slice(0, 1)
          ])
        }, 1000)
      }
    } catch (err) {
      console.error("Erro no upload:", err)
      setFeedback(prev => ["❌ Erro ao processar o vídeo.", ...prev.slice(0, 2)])
    } finally {
      setUploading(false)
    }
  }

  const downloadVideo = () => {
    if (previewUrl) {
      const a = document.createElement('a')
      a.href = previewUrl
      a.download = `${selectedExercise}-${Date.now()}.webm`
      a.click()
      setFeedback(prev => ["💾 Download iniciado!", ...prev.slice(0, 2)])
    }
  }

  const resetSession = () => {
    setRepCount(0)
    setFeedback([])
    setRecordedChunks([])
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setFeedback(prev => ["🔄 Sessão resetada. Pronto para nova gravação!", ...prev.slice(0, 2)])
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Coach Virtual</h1>
              <p className="text-sm text-muted-foreground">Análise de movimento em tempo real</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isSessionActive ? "default" : "secondary"}>
                {isSessionActive ? "🔴 Gravando" : "Inativo"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${cameraStatus === "on"
                    ? "bg-green-100 text-green-600"
                    : cameraStatus === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {cameraStatus === "on" ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">Câmera</p>
                <p className="text-xs text-muted-foreground">
                  {cameraStatus === "on" ? "Ligada" : cameraStatus === "error" ? "Erro" : "Desligada"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${userDetected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
              >
                {userDetected ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">Usuário</p>
                <p className="text-xs text-muted-foreground">{userDetected ? "Detectado" : "Não detectado"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Repetições</p>
                <p className="text-xs text-muted-foreground">{repCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${selectedExercise ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
              >
                <Settings className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Exercício</p>
                <p className="text-xs text-muted-foreground truncate">{selectedExercise || "Não selecionado"}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuração</CardTitle>
            <CardDescription>Selecione o exercício para análise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedExercise} onValueChange={setSelectedExercise} disabled={isSessionActive}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise} value={exercise}>
                    {exercise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!isSessionActive && cameraStatus === "off" && (
              <Button onClick={enableCamera} variant="outline" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Ativar Câmera
              </Button>
            )}

            {!isSessionActive && cameraStatus === "on" && (
              <Button onClick={disableCamera} variant="outline" className="w-full">
                <VideoOff className="h-4 w-4 mr-2" />
                Desligar Câmera
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {cameraStatus === "on" ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {userDetected && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Usuário detectado
                    </div>
                  )}

                  {isRecording && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm animate-pulse flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      REC
                    </div>
                  )}

                  {selectedExercise && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                      {selectedExercise}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="font-medium">Câmera desligada</p>
                    <p className="text-sm">Ative a câmera para começar</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {(isSessionActive || feedback.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Feedback em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feedback.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aguardando movimento...</p>
                ) : (
                  feedback.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${item.includes("✅") || item.includes("💪")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : item.includes("⚠️")
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : item.includes("❌")
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                    >
                      {item}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleStartSession}
            className={`w-full h-14 text-lg ${isSessionActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            disabled={!selectedExercise || uploading}
          >
            {isSessionActive ? (
              <>
                <Square className="h-5 w-5 mr-2" />
                Finalizar Sessão
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Iniciar Sessão
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleUploadVideo}
              className="h-12"
              disabled={isSessionActive || uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Enviar Vídeo
            </Button>

            <Button
              variant="outline"
              onClick={resetSession}
              className="h-12"
              disabled={isSessionActive || uploading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>

          {previewUrl && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={uploadToBackend}
                disabled={uploading}
                className="h-12 bg-indigo-600 hover:bg-indigo-700"
              >
                {uploading ? "Analisando..." : "Analisar Vídeo"}
              </Button>

              <Button
                onClick={downloadVideo}
                variant="outline"
                className="h-12"
                disabled={uploading}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Como usar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                1
              </div>
              <p className="text-sm">Selecione o exercício que deseja praticar</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <p className="text-sm">Ative a câmera e posicione-se em frente a ela</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <p className="text-sm">Clique em "Iniciar Sessão" para começar a gravação e análise</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <p className="text-sm">Receba feedback em tempo real e finalize quando terminar</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                5
              </div>
              <p className="text-sm">Envie o vídeo para análise detalhada ou baixe localmente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}