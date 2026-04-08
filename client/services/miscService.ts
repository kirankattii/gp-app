class MiscService {

  static isMobile() {
    if (typeof window === "undefined") {
      return false; // Default to non-mobile during SSR
    }
    return window.innerWidth < 768;
  }
}

export default MiscService;
