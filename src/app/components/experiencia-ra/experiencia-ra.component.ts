import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experiencia-ra',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './experiencia-ra.component.html',
  styleUrls: ['./experiencia-ra.component.css'],
})
export class ExperienciaRaComponent implements AfterViewInit, OnInit, OnDestroy  {
  private videoElement: HTMLVideoElement | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  public isRecording = false;
  public animationFrameId: number = 0;
  private sidebarSubscription: Subscription | undefined;
  sidebarCollapsed: boolean = false;

  ngOnInit(): void {
    // Nos suscribimos al observable del estado del sidebar
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(state => {
      this.sidebarCollapsed = state;
    });
  }

  ngOnDestroy(): void {
    // Importante: limpiar la suscripción cuando el componente se destruye
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private sidebarService: SidebarService) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('El componente solo funciona en el navegador.');
      return;
    }

    // Espera a que se cree el elemento de video en el DOM
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const videoElement = document.querySelector('body > video') as HTMLVideoElement;
        if (videoElement) {
          this.videoElement = videoElement; // Asigna el video encontrado
          console.log('Elemento de video encontrado:', videoElement);
          observer.disconnect(); // Deja de observar una vez que se encuentra el video
        }
      }
    }
  });

  // Observa cambios en el DOM para detectar el video de AR.js
  observer.observe(document.body, { childList: true, subtree: true });

    this.initializeScene();
    this.hideARVideo();
    this.updatePositionLabel();
  }

  /**
   * Inicializa la escena de A-Frame y maneja eventos del modelo GLB.
   */
  private initializeScene(): void {
    const scene = document.querySelector('a-scene');
    const model = document.querySelector('[gltf-model]') as HTMLElement;
    const placeholder = document.getElementById('placeholder');

    if (!scene) {
      console.error('No se encontró el elemento <a-scene>.');
      return;
    }

    scene.addEventListener('renderstart', () => {
      console.log('La escena se ha renderizado completamente.');
    });

    if (model) {
      // Manejo del evento de carga del modelo GLB.
      model.addEventListener('loaded', () => {
        console.log('Modelo GLB cargado correctamente.');
        if (placeholder) placeholder.setAttribute('visible', 'false');
        model.setAttribute('visible', 'true');
      });

      // Manejo del evento de error al cargar el modelo GLB.
      model.addEventListener('error', (error) => {
        console.error('Error al cargar el modelo GLB:', error);
        this.retryLoadModel(model);
      });
    } else {
      console.error('No se encontró el elemento del modelo GLB.');
    }
  }

  /**
   * Reintenta cargar el modelo GLB en caso de error.
   */
  private retryLoadModel(model: HTMLElement, retries = 3): void {
    if (retries <= 0) {
      console.error('No se pudo cargar el modelo GLB después de varios intentos.');
      return;
    }
    console.warn('Reintentando cargar el modelo GLB...');
    setTimeout(() => {
      model.setAttribute('gltf-model', '#modeloGLB');
      this.retryLoadModel(model, retries - 1);
    }, 3000);
  }

  /**
   * Oculta el video de la cámara utilizado por AR.js.
   */
  private hideARVideo(): void {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const arVideo = document.querySelector('body > video') as HTMLElement;
          if (arVideo) {
            arVideo.style.width = '0';
            arVideo.style.height = '0';
            arVideo.style.display = 'none';
            observer.disconnect();
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Actualiza las coordenadas GPS en la etiqueta de posición.
   */
  private updatePositionLabel(): void {
    const label = document.getElementById('position-label');
    const model = document.querySelector('[gltf-model]') as HTMLElement;
  
    // Verifica si el modelo existe
    if (!model) {
      console.error('No se encontró el modelo GLB.');
      return;
    }
  
    navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);
  
        // Actualiza la etiqueta con las coordenadas
        if (label) {
          label.innerHTML = `Latitud: ${latitude}, Longitud: ${longitude}`;
        }
  
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        if (label) {
          label.innerHTML = 'Error obteniendo ubicación';
        }
      },
      { enableHighAccuracy: true }
    );
  }
  

  /**
   * Captura una foto combinando el video y la escena 3D.
   */
  capturePhoto(): void {
    const sceneCanvas = document.querySelector('a-scene canvas') as HTMLCanvasElement;
    const cameraVideo = document.querySelector('video') as HTMLVideoElement;
  
    if (!sceneCanvas || !cameraVideo) {
      console.error('No se encontró el canvas de la escena o el video de la cámara.');
      return;
    }
  
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = cameraVideo.videoWidth;
    combinedCanvas.height = cameraVideo.videoHeight;
  
    const context = combinedCanvas.getContext('2d');
    if (context) {
      // Asegúrate de capturar el contenido después de renderizar.
      requestAnimationFrame(() => {
        context.drawImage(cameraVideo, 0, 0, combinedCanvas.width, combinedCanvas.height);
        context.drawImage(sceneCanvas, 0, 0, combinedCanvas.width, combinedCanvas.height);
  
        const photoDataURL = combinedCanvas.toDataURL('image/png');
        this.downloadFile(photoDataURL, 'captura_combinada.png');
        console.log('Foto capturada exitosamente.');
      });
    }
  }
  

  /**
   * Inicia la grabación de video.
   */
  startVideoRecording(): void {
    const sceneCanvas = document.querySelector('a-scene canvas') as HTMLCanvasElement;
    const cameraVideo = document.querySelector('video') as HTMLVideoElement;
  
    if (!sceneCanvas || !cameraVideo) {
      console.error('No se encontró el canvas de la escena o el video de la cámara.');
      return;
    }
  
    // Crear un canvas combinado
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = cameraVideo.videoWidth;
    combinedCanvas.height = cameraVideo.videoHeight;
    const context = combinedCanvas.getContext('2d');
  
    if (!context) {
      console.error('No se pudo obtener el contexto del canvas combinado.');
      return;
    }
  
    // Dibujar en el canvas combinado en intervalos regulares
    this.animationFrameId = requestAnimationFrame(() => {
      const drawCombinedCanvas = () => {
        context.drawImage(cameraVideo, 0, 0, combinedCanvas.width, combinedCanvas.height);
        context.drawImage(sceneCanvas, 0, 0, combinedCanvas.width, combinedCanvas.height);
        this.animationFrameId = requestAnimationFrame(drawCombinedCanvas);
      };
      drawCombinedCanvas();
    });
  
    // Capturar el audio del micrófono
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((audioStream) => {
        // Crear un stream del canvas combinado
        const videoStream = combinedCanvas.captureStream();
  
        // Combinar audio y video
        const combinedStream = new MediaStream([
          ...videoStream.getTracks(),
          ...audioStream.getTracks(),
        ]);
  
        // Configurar MediaRecorder con el stream combinado
        this.mediaRecorder = new MediaRecorder(combinedStream);
  
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
  
        this.mediaRecorder.onstop = () => {
          cancelAnimationFrame(this.animationFrameId);
          const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
          const videoURL = URL.createObjectURL(blob);
          this.downloadFile(videoURL, 'grabacion_con_audio.mp4');
          this.recordedChunks = [];
        };
  
        this.mediaRecorder.start();
        this.isRecording = true;
        console.log('Grabación con audio iniciada.');
      })
      .catch((error) => {
        console.error('Error al capturar el audio:', error);
      });
  }
  
  
  stopVideoRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      console.log('Grabación detenida.');
    }
  }
  
  /**
   * Descarga un archivo desde un URL de datos.
   */
  private downloadFile(dataUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
}
