'use client'

import { useAppPreference } from '@/store'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useRecorder() {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  const recorderRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const cleanup = useCallback(() => {
    stopTimer()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {})
    }
  }, [stopTimer])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const startRecording = async () => {
    try {
      const RecordRTCModule = await import('recordrtc')
      const RecordRTC = RecordRTCModule.default

      const { deviceId } = useAppPreference.getState()

      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        })
      } catch (err) {
        if (deviceId) {
          // Fallback if deviceId constraint is not satisfied or invalid on Safari
          stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } else {
          throw err
        }
      }
      streamRef.current = stream

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContextClass()
      audioCtxRef.current = audioCtx
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume()
      }
      const source = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 256
      analyserNode.smoothingTimeConstant = 0.8
      source.connect(analyserNode)
      setAnalyser(analyserNode)

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      })

      recorder.startRecording()
      recorderRef.current = recorder
      setRecordingSeconds(0)
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
      return true
    } catch (err) {
      console.error(err)
      toast.error('Không thể bắt đầu ghi âm. Vui lòng kiểm tra Micro.')
      return false
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!recorderRef.current) {
        return reject(new Error('Recorder not started'))
      }

      stopTimer()
      setAnalyser(null)
      setIsRecording(false)

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }

      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob()
        streamRef.current?.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        resolve(blob)
      })
    })
  }

  const destroyRecorder = useCallback(() => {
    cleanup()
    if (recorderRef.current) {
      recorderRef.current.destroy()
      recorderRef.current = null
    }
  }, [cleanup])

  return {
    analyser,
    recordingSeconds,
    isRecording,
    startRecording,
    stopRecording,
    destroyRecorder,
  }
}
