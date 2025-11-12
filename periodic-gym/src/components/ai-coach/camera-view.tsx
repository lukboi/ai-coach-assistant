import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  cameraStatus: 'off' | 'on' | 'error'
  isRecording: boolean
  userDetected: boolean
  selectedExercise: string
}

export function CameraView({
  videoRef,
  cameraStatus,
  isRecording,
  userDetected,
  selectedExercise
}: CameraViewProps) {
  return (
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
  )
}
