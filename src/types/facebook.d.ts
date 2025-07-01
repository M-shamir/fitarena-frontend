declare global {
    interface Window {
      FB: any;
    }
  }
  
  interface FacebookAuthResponse {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  }