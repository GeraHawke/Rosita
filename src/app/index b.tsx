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
} from 'react-native';

import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const onRegister = () => {
    router.push({
      pathname: "/register",
    });
  }

  // Estados de los campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados de error (texto que aparece debajo)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Estados visuales de validación
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');

  // Animaciones de borde
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  // Colores
  const ORANGE = '#C95732';
  const BLUE = '#4FA9C6';
  const RED = '#D61F3A';
  const GREEN = '#2E7D32';

  // ========== VALIDACIONES ==========
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El email no puede estar vacío';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'El email no es válido';
    return '';
  };

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

  // Animación de borde
  const animateBorder = (animValue: Animated.Value, duration = 900) => {
    animValue.setValue(0);
    return Animated.timing(animValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  // Color del borde según estado
  const getBorderColor = (animValue: Animated.Value, status: string) => {
    if (status === 'error') return RED;
    if (status === 'success') return GREEN;
    if (status === 'checking') {
      return animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [ORANGE, BLUE, ORANGE],
      });
    }
    return ORANGE;
  };

  // Limpiar todo
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setEmailStatus('idle');
    setPasswordStatus('idle');
  };

  // ========== LÓGICA DEL BOTÓN ==========
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
      Alert.alert(
        'LOGIN EXITOSO',
        'Bienvenido. Has iniciado sesión correctamente.',
        [
          {
            text: 'OK',
            onPress: clearForm, // ← limpia los campos al cerrar el alert
          },
        ],
        { cancelable: false }
      );
    }, 400);
  };

  return (
    <View style={styles.container}>
      {/* ========== IMAGEN ========== */}
      {/* Cambia la ruta según donde tengas el archivo */}
      <Image
        source={require('./bluetech.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* ========== EMAIL ========== */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
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
            />
          </Animated.View>

          {/* Contenedor fijo para el icono → evita que la caja se encoja */}
          <View style={styles.iconContainer}>
            {emailStatus === 'checking' && (
              <ActivityIndicator size="small" color={BLUE} />
            )}
            {emailStatus === 'success' && (
              <Text style={[styles.checkIcon, { color: GREEN }]}>✓</Text>
            )}
          </View>
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* ========== CONTRASEÑA ========== */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputRow}>
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
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordStatus !== 'idle') {
                  setPasswordStatus('idle');
                  setPasswordError('');
                }
              }}
            />
          </Animated.View>

          {/* Contenedor fijo para el icono → evita que la caja se encoja */}
          <View style={styles.iconContainer}>
            {passwordStatus === 'checking' && (
              <ActivityIndicator size="small" color={BLUE} />
            )}
            {passwordStatus === 'success' && (
              <Text style={[styles.checkIcon, { color: GREEN }]}>✓</Text>
            )}
          </View>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      {/* ========== BOTÓN ========== */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <Button title="Registro" onPress={onRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E6E3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 240,        // ← más grande (ajusta si quieres aún más)
    height: 140,       // ← más grande
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
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
  // Espacio fijo reservado para el icono (así la caja nunca se encoje)
  iconContainer: {
    width: 32,
    height: 32,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 24,
    fontWeight: 'bold',
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
});