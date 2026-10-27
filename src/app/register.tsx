import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';

/**
 * Pantalla de Registro
 *
 * Campos:
 *  1. Email
 *  2. Nombre de usuario
 *  3. Contraseña
 *  4. Confirmar contraseña
 *
 * Validaciones (Práctica R4):
 *  - Email validado con regex
 *  - Ningún campo vacío
 *  - Contraseña oculta (secureTextEntry)
 *  - Ambas contraseñas deben coincidir
 *  - Contraseña: mínimo 8 caracteres, mayúsculas, minúsculas y 1 carácter especial
 *
 * Comportamiento:
 *  - Mientras valida: borde oscila entre rojo (#D61F3A) y azul (#4FA9C6)
 *  - Error → borde rojo fijo + mensaje
 *  - Éxito → borde verde fijo
 *  - Si TODO es correcto → navega al Index
 *  - Si hay error → muestra Alert
 *  - Botón/texto atrás habilitado (header de expo-router)
 */
export default function Register() {
  // ========== NAVEGACIÓN ==========
  const router = useRouter();

  /** Vuelve a la pantalla anterior (Index) */
  const goBack = () => {
    router.back();
  };

  // ========== ESTADOS DE LOS CAMPOS ==========
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ========== ESTADOS DE ERROR ==========
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // ========== ESTADOS VISUALES ==========
  type Status = 'idle' | 'checking' | 'success' | 'error';
  const [emailStatus, setEmailStatus] = useState<Status>('idle');
  const [usernameStatus, setUsernameStatus] = useState<Status>('idle');
  const [passwordStatus, setPasswordStatus] = useState<Status>('idle');
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<Status>('idle');

  // ========== ANIMACIONES DE BORDE ==========
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const usernameBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;

  // ========== COLORES ==========
  const ORANGE = '#C95732';
  const BLUE = '#4FA9C6';
  const RED = '#D61F3A';
  const GREEN = '#2E7D32';

  // ========== VALIDACIONES ==========

  /**
   * Valida email: no vacío + formato regex
   */
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El email no puede estar vacío';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'El email no es válido';
    return '';
  };

  /**
   * Valida nombre de usuario: no vacío
   */
  const validateUsername = (value: string): string => {
    if (!value.trim()) return 'El nombre de usuario no puede estar vacío';
    return '';
  };

  /**
   * Valida contraseña:
   * - No vacía
   * - Mínimo 8 caracteres
   * - Mayúsculas y minúsculas
   * - Al menos 1 carácter especial
   */
  const validatePassword = (value: string): string => {
    if (!value) return 'La contraseña no puede estar vacía';
    if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una mayúscula';
    if (!/[a-z]/.test(value)) return 'La contraseña debe incluir al menos una minúscula';
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(value)) {
      return 'La contraseña debe incluir al menos un carácter especial';
    }
    return '';
  };

  /**
   * Valida que las dos contraseñas coincidan
   */
  const validateConfirmPassword = (value: string, original: string): string => {
    if (!value) return 'Debes confirmar la contraseña';
    if (value !== original) return 'Las contraseñas no coinciden';
    return '';
  };

  // ========== ANIMACIÓN ==========

  /** Inicia oscilación del borde (rojo ↔ azul) */
  const animateBorder = (animValue: Animated.Value, duration = 900) => {
    animValue.setValue(0);
    return Animated.timing(animValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Color del borde según estado:
   * - checking → oscila rojo ↔ azul
   * - error → rojo fijo
   * - success → verde fijo
   * - idle → naranja
   */
  const getBorderColor = (animValue: Animated.Value, status: Status) => {
    if (status === 'error') return RED;
    if (status === 'success') return GREEN;
    if (status === 'checking') {
      return animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [RED, BLUE, RED],
      });
    }
    return ORANGE;
  };

  // ========== LIMPIAR ==========
  const clearForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmailStatus('idle');
    setUsernameStatus('idle');
    setPasswordStatus('idle');
    setConfirmPasswordStatus('idle');
  };

  // ========== LÓGICA DE REGISTRO ==========
  const handleRegister = async () => {
    // Reset de estados
    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmailStatus('idle');
    setUsernameStatus('idle');
    setPasswordStatus('idle');
    setConfirmPasswordStatus('idle');

    let hasError = false;

    // ----- 1. Email -----
    const emailMsg = validateEmail(email);
    setEmailStatus('checking');
    animateBorder(emailBorderAnim);
    await new Promise((r) => setTimeout(r, 800));

    if (emailMsg) {
      setEmailError(emailMsg);
      setEmailStatus('error');
      hasError = true;
    } else {
      setEmailStatus('success');
    }

    // ----- 2. Nombre de usuario -----
    const usernameMsg = validateUsername(username);
    setUsernameStatus('checking');
    animateBorder(usernameBorderAnim);
    await new Promise((r) => setTimeout(r, 800));

    if (usernameMsg) {
      setUsernameError(usernameMsg);
      setUsernameStatus('error');
      hasError = true;
    } else {
      setUsernameStatus('success');
    }

    // ----- 3. Contraseña -----
    const passMsg = validatePassword(password);
    setPasswordStatus('checking');
    animateBorder(passwordBorderAnim);
    await new Promise((r) => setTimeout(r, 800));

    if (passMsg) {
      setPasswordError(passMsg);
      setPasswordStatus('error');
      hasError = true;
    } else {
      setPasswordStatus('success');
    }

    // ----- 4. Confirmar contraseña -----
    const confirmMsg = validateConfirmPassword(confirmPassword, password);
    setConfirmPasswordStatus('checking');
    animateBorder(confirmPasswordBorderAnim);
    await new Promise((r) => setTimeout(r, 800));

    if (confirmMsg) {
      setConfirmPasswordError(confirmMsg);
      setConfirmPasswordStatus('error');
      hasError = true;
    } else {
      setConfirmPasswordStatus('success');
    }

    // ----- Resultado final -----
    if (hasError) {
      Alert.alert(
        'Error de registro',
        'Por favor corrige los campos marcados en rojo e intenta de nuevo.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Todo correcto → Alert de éxito y navegar al Index
    Alert.alert(
      'REGISTRO EXITOSO',
      'Tu cuenta ha sido creada correctamente.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearForm();
            router.replace('/'); // vuelve al Index
          },
        },
      ],
      { cancelable: false }
    );
  };

  // ========== RENDER ==========
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      testID="register-screen"
    >
      <View style={styles.container}>
        {/* ========== EMAIL ========== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: getBorderColor(emailBorderAnim, emailStatus) },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailStatus !== 'idle') {
                  setEmailStatus('idle');
                  setEmailError('');
                }
              }}
              testID="register-email-input"
            />
          </Animated.View>
          {emailStatus === 'checking' && (
            <ActivityIndicator size="small" color={BLUE} style={styles.loader} />
          )}
          {emailError ? (
            <Text style={styles.errorText} testID="register-email-error">
              {emailError}
            </Text>
          ) : null}
        </View>

        {/* ========== NOMBRE DE USUARIO ========== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: getBorderColor(usernameBorderAnim, usernameStatus) },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (usernameStatus !== 'idle') {
                  setUsernameStatus('idle');
                  setUsernameError('');
                }
              }}
              testID="register-username-input"
            />
          </Animated.View>
          {usernameStatus === 'checking' && (
            <ActivityIndicator size="small" color={BLUE} style={styles.loader} />
          )}
          {usernameError ? (
            <Text style={styles.errorText} testID="register-username-error">
              {usernameError}
            </Text>
          ) : null}
        </View>

        {/* ========== CONTRASEÑA ========== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor: getBorderColor(passwordBorderAnim, passwordStatus) },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordStatus !== 'idle') {
                  setPasswordStatus('idle');
                  setPasswordError('');
                }
              }}
              testID="register-password-input"
            />
          </Animated.View>
          {passwordStatus === 'checking' && (
            <ActivityIndicator size="small" color={BLUE} style={styles.loader} />
          )}
          {passwordError ? (
            <Text style={styles.errorText} testID="register-password-error">
              {passwordError}
            </Text>
          ) : null}
        </View>

        {/* ========== CONFIRMAR CONTRASEÑA ========== */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                borderColor: getBorderColor(
                  confirmPasswordBorderAnim,
                  confirmPasswordStatus
                ),
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordStatus !== 'idle') {
                  setConfirmPasswordStatus('idle');
                  setConfirmPasswordError('');
                }
              }}
              testID="register-confirm-password-input"
            />
          </Animated.View>
          {confirmPasswordStatus === 'checking' && (
            <ActivityIndicator size="small" color={BLUE} style={styles.loader} />
          )}
          {confirmPasswordError ? (
            <Text style={styles.errorText} testID="register-confirm-password-error">
              {confirmPasswordError}
            </Text>
          ) : null}
        </View>

        {/* ========== BOTÓN REGISTRAR ========== */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.8}
          testID="register-submit-button"
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* ========== BOTÓN ATRÁS (texto) ========== */}
        {/* Además del header nativo de expo-router, dejamos un texto clickeable */}
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
          testID="register-back-button"
        >
          <Text style={styles.backButtonText}>← Atrás</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  fieldContainer: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0A0F',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#C95732',
    backgroundColor: '#FFFFFF',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0A0A0F',
  },
  loader: {
    marginTop: 6,
    alignSelf: 'center',
  },
  errorText: {
    color: '#D61F3A',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
    textAlign: 'left',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#6B2D5C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#E8E6E3',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 20,
    padding: 8,
  },
  backButtonText: {
    color: '#6B2D5C',
    fontSize: 16,
    fontWeight: '600',
  },
});
