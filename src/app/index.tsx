import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  ActivityIndicator,
  Button, // <-- IMPORTANTE: Button debe importarse de react-native
} from 'react-native';

import { useRouter } from 'expo-router';

/**
 * Pantalla de Login (Index)
 * - Validación de email con regex
 * - Validación de contraseña (longitud, mayúsculas, minúsculas, carácter especial)
 * - Animación de borde oscilante entre rojo y azul mientras valida
 * - Borde fijo en rojo (error) o verde (éxito)
 * - Botón de Registro que navega a /register
 */
export default function Index() {
  // ========== NAVEGACIÓN ==========
  const router = useRouter();

  /** Navega a la pantalla de registro */
  const onRegister = () => {
    router.push({
      pathname: '/register',
    });
  };

  /** Navega a la pantalla de home */
  const onHome = () => {
    router.push({
      pathname: '/home',
    });
  };

  // ========== ESTADOS DE LOS CAMPOS ==========
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ========== ESTADOS DE ERROR (texto debajo del input) ==========
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ========== ESTADOS VISUALES DE VALIDACIÓN ==========
  // 'idle' | 'checking' | 'success' | 'error'
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');

  // ========== ANIMACIONES DE BORDE ==========
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  // ========== COLORES ==========
  const ORANGE = '#C95732'; // color inicial / idle
  const BLUE = '#4FA9C6';   // color de oscilación
  const RED = '#D61F3A';    // color de error + oscilación
  const GREEN = '#2E7D32';  // color de éxito

  // ========== VALIDACIONES ==========

  /**
   * Valida el email:
   * - No vacío
   * - Formato correcto con regex
   * @returns mensaje de error o cadena vacía si es válido
   */
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El email no puede estar vacío';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'El email no es válido';
    return '';
  };

  /**
   * Valida la contraseña:
   * - No vacía
   * - Mínimo 8 caracteres
   * - Al menos una mayúscula
   * - Al menos una minúscula
   * - Al menos un carácter especial
   * @returns mensaje de error o cadena vacía si es válido
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

  // ========== ANIMACIÓN DE BORDE ==========

  /**
   * Inicia la animación de oscilación del borde.
   * Oscila entre rojo (#D61F3A) y azul (#4FA9C6).
   */
  const animateBorder = (animValue: Animated.Value, duration = 900) => {
    animValue.setValue(0);
    return Animated.timing(animValue, {
      toValue: 1,
      duration,
      useNativeDriver: false, // necesario porque borderColor no soporta native driver
    }).start();
  };

  /**
   * Devuelve el color del borde según el estado actual.
   * - error  → rojo fijo
   * - success → verde fijo
   * - checking → interpolación rojo ↔ azul (oscilación)
   * - idle → naranja
   */
  const getBorderColor = (animValue: Animated.Value, status: string) => {
    if (status === 'error') return RED;
    if (status === 'success') return GREEN;
    if (status === 'checking') {
      return animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [RED, BLUE, RED], // oscila entre rojo y azul
      });
    }
    return ORANGE;
  };

  // ========== LIMPIAR FORMULARIO ==========
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setEmailStatus('idle');
    setPasswordStatus('idle');
  };

  // ========== LÓGICA DEL BOTÓN LOGIN ==========
  const handleLogin = async () => {
    // Limpiar estados de error anteriores
    setEmailError('');
    setPasswordError('');
    setEmailStatus('idle');
    setPasswordStatus('idle');

    // 1. Validar email
    const emailMsg = validateEmail(email);
    setEmailStatus('checking');
    animateBorder(emailBorderAnim);

    // Simula tiempo de validación (animación visible)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (emailMsg) {
      setEmailError(emailMsg);
      setEmailStatus('error');
      return;
    }

    setEmailStatus('success');

    // Pequeña pausa antes de la contraseña
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 2. Validar contraseña
    const passMsg = validatePassword(password);
    setPasswordStatus('checking');
    animateBorder(passwordBorderAnim);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (passMsg) {
      setPasswordError(passMsg);
      setPasswordStatus('error');
      return;
    }

    setPasswordStatus('success');

    // Todo correcto → Alert de éxito y al cerrar se limpia el formulario
    setTimeout(() => {
      clearForm();
      router.push({ pathname: '/home' });
    }, 400);
  };

  // ========== RENDER ==========
  return (
    <View style={styles.container} testID="login-screen">
      {/* ========== LOGO ========== */}
      <Image
        source={require('./bluetech.png')}
        style={styles.logo}
        resizeMode="contain"
        testID="login-logo"
      />

      {/* ========== CAMPO EMAIL ========== */}
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
              // Si el usuario vuelve a escribir, reseteamos el estado visual
              if (emailStatus !== 'idle') {
                setEmailStatus('idle');
                setEmailError('');
              }
            }}
            testID="login-email-input"
          />
        </Animated.View>
        {/* Indicador de carga mientras valida (sin check verde) */}
        {emailStatus === 'checking' && (
          <ActivityIndicator
            size="small"
            color={BLUE}
            style={styles.loader}
            testID="login-email-loader"
          />
        )}
        {emailError ? (
          <Text style={styles.errorText} testID="login-email-error">
            {emailError}
          </Text>
        ) : null}
      </View>

      {/* ========== CAMPO CONTRASEÑA ========== */}
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
            testID="login-password-input"
          />
        </Animated.View>
        {passwordStatus === 'checking' && (
          <ActivityIndicator
            size="small"
            color={BLUE}
            style={styles.loader}
            testID="login-password-loader"
          />
        )}
        {passwordError ? (
          <Text style={styles.errorText} testID="login-password-error">
            {passwordError}
          </Text>
        ) : null}
      </View>

      {/* ========== BOTÓN INICIAR SESIÓN ========== */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.8}
        testID="login-submit-button"
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* ========== BOTÓN REGISTRO ========== */}
      {/* Usamos el componente Button de react-native (como en la captura de la práctica) */}
      <View style={styles.registerButtonContainer}>
        <Button
          title="Registro"
          onPress={onRegister}
          color="#6B2D5C"
          testID="login-register-button"
        />
      </View>
    </View>
  );
}

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 240,
    height: 140,
    marginBottom: 36,
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
  // Wrapper del input: mismo ancho para todos, centrado
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
  // Loader centrado debajo del input (sin ocupar espacio al lado)
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
  registerButtonContainer: {
    width: '100%',
    maxWidth: 340,
    marginTop: 16,
  },
});
