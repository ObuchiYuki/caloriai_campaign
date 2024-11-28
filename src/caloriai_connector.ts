import html2canvas from "html2canvas";

export type APICallMethod = "GET"|"POST"|"PATCH"|"PUT"|"DELETE"|"HEAD";

export type APICommand = {
  endpoint: string,
  method?: APICallMethod, // default: "GET"
  headers?: { [Key: string]: string },
  body?: string,
  [Key: string]: any // エンコード可能なその他のプロパティ
}

export type APIResponseSuccess = {
  type: "succeeded"
  status: number,
  body: string,
  command: APICommand // 与えたコマンドの内容を反復
}

export type APIResponseFail = {
  type: "failed",
  body?: string, // 1.2.4での追加部分なので、1.2.3以前を対象にする場合は利用不可
  status?: number, // 1.2.3での追加部分なので、1.2.2以前を対象にする場合は利用不可
  command: APICommand // 与えたコマンドの内容を反復
}

export type APIResponse = APIResponseSuccess | APIResponseFail

declare global {
  interface Window {
    callAction: (payload: { type: string, payload?: any }) => void;
    webkit: {
      messageHandlers: {
        [Key in string]: any
      }
    }
  }
}

const windowCallActionHandlers = new Map<string, (payload: any) => void>();
window.callAction = (payload: { type: string, payload?: any }) => {
  const handler = windowCallActionHandlers.get(payload.type);
  if (handler) {
    handler(payload.payload);
  }
}

export const callAPI = (() => {
  const callbacks: Map<string, { resolve: (value: any) => void, reject: (reason: any) => void }> = new Map();

  const generateUniqueId = () => `api_call_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  windowCallActionHandlers.set("caloriai.api_call.success", (payload: any) => {
    try {
      if (!payload || typeof payload !== "object") {
        console.error("Invalid payload in native response:", payload);
        return;
      }

      if (!payload.command || !payload.command.id) {
        console.error("Missing command or command.id in payload:", payload);
        return;
      }

      const { command } = payload;
      const callback = callbacks.get(command.id);

      if (!callback) {
        console.error("No matching callback for command id:", command.id);
        return;
      }

      callback.resolve(payload);
      callbacks.delete(command.id);
    } catch (error) {
      console.error("Error handling native response:", error);
    }
  });

  windowCallActionHandlers.set("caloriai.api_call.fail", (payload: any) => {
    try {
      if (!payload || typeof payload !== "object") {
        console.error("Invalid payload in native response:", payload);
        return;
      }

      if (!payload.command || !payload.command.id) {
        console.error("Missing command or command.id in payload:", payload);
        return;
      }

      const { command } = payload;
      const callback = callbacks.get(command.id);

      if (!callback) {
        console.error("No matching callback for command id:", command.id);
        return;
      }

      callback.reject(payload);
      callbacks.delete(command.id);
    } catch (error) {
      console.error("Error handling native response:", error);
    }
  });

  return (command: APICommand): Promise<APIResponse> => {
      return new Promise((resolve, reject) => {
          try {
              if (!(
                command.endpoint.startsWith("https://api.caloriai.com") || 
                
                command.endpoint.startsWith("http://localhost") || 
                command.endpoint.startsWith("https://localhost") || 
                command.endpoint.startsWith("http://192.168") ||
                command.endpoint.startsWith("https://192.168")
              )) {
                  return reject(new Error("Invalid endpoint. Must be starting with https://api.caloriai.com or http(s)://localhost or http(s)://192.168"));
              }

              const id = generateUniqueId();
              const commandWithId = { ...command, id };

              callbacks.set(id, { resolve, reject });

              window.webkit.messageHandlers["caloriai.api_call"].postMessage(commandWithId);
          } catch (error) {
              reject(new Error(`Failed to initiate API call: ${error}`));
          }
      });
  };
})();

export const relogin=()=>{window.webkit.messageHandlers["caloriai.relogin"].postMessage({})}

export const closeModal=()=>{window.webkit.messageHandlers["caloriai.close_modal"].postMessage({})}

export const share = ({ rect, text, image }: { rect: {
  height: number;
  width: number;
  x: number;
  y: number;
}, text?: string, image?: string }) => {
  window.webkit.messageHandlers["caloriai.share"].postMessage({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    text: text,
    image: image
  })
}

export const saveImage = ({ image }: { image: string }) => {
  window.webkit.messageHandlers["caloriai.save_image"].postMessage(image)
}

export const ToastPreset = ["done", "error"] as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ToastPreset = typeof ToastPreset[number];

export const showToast = ({ title, subtitle, preset } : { title: string, subtitle?: string, preset?: ToastPreset }) => {
  window.webkit.messageHandlers["caloriai.show_toast"].postMessage({ title, subtitle, preset })
};

export const openOSBrowser = (url: string) => {
  window.webkit.messageHandlers["caloriai.open_os_browser"].postMessage(url)
}

export const openInAppBrowser = (url: string) => {
  window.webkit.messageHandlers["caloriai.open_in_app_browser"].postMessage(url)
}

export const pushToURL = (
  url: string, 
  {
    isNavigable = false, isShareable = false, isForeign = false
  }: {
    isNavigable?: boolean, isShareable?: boolean, isForeign?: boolean
  } = {}
) => {
  window.webkit.messageHandlers["caloriai.push_to_url"].postMessage({
    url: url,
    isNavigable: isNavigable,
    isShareable: isShareable,
    isForeign: isForeign
  })
}

export const elementToImageBase64 = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, { scale: 2 });
  let dataURL = canvas.toDataURL('image/png');
  dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  return dataURL;
}

export type ShareOnInstagramStoryBackgroundPayload = {
  type: "gradient",
  top: string,
  bottom: string
} | {
  type: "image",
  content: string
} | {
  type: "video",
  contentURL: string
}

export const canUseShareOnInstagramStory = () => {
  return window.webkit.messageHandlers["caloriai.share_on_instagram_story"] != null
}

export const shareOnInstagramStory = ({ stickerImage, background }: { stickerImage?: string, background?: ShareOnInstagramStoryBackgroundPayload }) => {
  const handler = window.webkit.messageHandlers["caloriai.share_on_instagram_story"]
  if (handler == null) {
    return;
  }
  if (background == null) {
    handler.postMessage({ 
      stickerImage: stickerImage
    })
  } else if (background.type == "gradient") {
    handler.postMessage({ 
      stickerImage: stickerImage, 
      backgroundTopColor: background.top,
      backgroundBottomColor: background.bottom
    })
  } else if (background.type == "image") {
    handler.postMessage({ 
      stickerImage: stickerImage, 
      backgroundImage: background.content
    })
  } else if (background.type == "video") {
    handler.postMessage({ 
      stickerImage: stickerImage, 
      backgroundVideo: background.contentURL
    })
  }
}


export type GetClipBoardPayload = {
  type: "success",
  text?: string
}

export const getClipboardText = (() => {
  const callbacks: Map<string, { resolve: (value: any) => void, reject: (reason: any) => void }> = new Map();

  const generateUniqueId = () => `get_clipboard_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  windowCallActionHandlers.set("caloriai.get_clipboard.success", (payload: any) => {
    try {
      if (!payload || typeof payload !== "object") {
        console.error("Invalid payload in native response:", payload);
        return;
      }

      if (!payload.command || !payload.command.id) {
        console.error("Missing command or command.id in payload:", payload);
        return;
      }

      const { command } = payload;
      const callback = callbacks.get(command.id);

      if (!callback) {
        console.error("No matching callback for command id:", command.id);
        return;
      }

      callback.resolve(payload);
      callbacks.delete(command.id);
    } catch (error) {
      console.error("Error handling native response:", error);
    }
  });
  
  return () => {
      return new Promise<GetClipBoardPayload>((resolve, reject) => {
          try {
              const id = generateUniqueId();
              const command = { id };

              callbacks.set(id, { resolve, reject });

              window.webkit.messageHandlers["caloriai.get_clipboard"].postMessage(command);
          } catch (error) {
              reject(new Error(`Failed to initiate API call: ${error}`));
          }
      });
  };
})();