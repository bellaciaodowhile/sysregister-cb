// Sound effects disabled per user request
class SoundFX {
  public setEnabled(_val: boolean) {}
  public isEnabled(): boolean { return false; }
  public playClick() {}
  public playPlugIn() {}
  public playSuccess() {}
  public playSwitch() {}
  public playDelete() {}
  public playError() {}
}

export const sound = new SoundFX();
