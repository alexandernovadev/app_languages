import { Vibration, Platform } from 'react-native';

// Vibration Patterns
const LIGHT_PATTERN = [4, 60];  // Short, light vibration
const MEDIUM_PATTERN = [4, 120];  // Medium vibration
const HEAVY_PATTERN = [4, 210];  // Strong, heavy vibration
const DOUBLE_TAP_PATTERN = [4, 60, 110, 60];  // Quick double tap
const SINE_WAVE_PATTERN = [4, 60, 60, 100, 60, 160, 60, 200];  // Simulates sine wave
const HEARTBEAT_PATTERN = [4, 110, 60, 110];  // Heartbeat-like pattern
const PULSE_PATTERN = [4, 60, 110, 60, 200, 60];  // Rhythmic pulse
const RAPID_FIRE_PATTERN = [4, 40, 40, 40, 40, 40, 40, 40];  // Rapid short bursts

// Interface for vibration levels
interface VibrationPatterns {
  light: number[];
  medium: number[];
  heavy: number[];
  doubleTap: number[];
  sineWave: number[];
  heartbeat: number[];
  pulse: number[];
  rapidFire: number[];
}

// Assigning patterns to the interface
const vibrationPatterns: VibrationPatterns = {
  light: LIGHT_PATTERN,
  medium: MEDIUM_PATTERN,
  heavy: HEAVY_PATTERN,
  doubleTap: DOUBLE_TAP_PATTERN,
  sineWave: SINE_WAVE_PATTERN,
  heartbeat: HEARTBEAT_PATTERN,
  pulse: PULSE_PATTERN,
  rapidFire: RAPID_FIRE_PATTERN,
};

// Function to trigger vibrations
export const triggerVibration = (type: keyof VibrationPatterns = 'medium') => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(); // iOS only supports basic vibration
  } else {
    const pattern = vibrationPatterns[type];
    if (pattern) {
      Vibration.vibrate(pattern);
    }
  }
};
