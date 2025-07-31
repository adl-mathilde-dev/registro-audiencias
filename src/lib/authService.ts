import pool from './database';
import bcrypt from 'bcryptjs';
import { Usuario, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const authService = {
  // Registrar nuevo usuario
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Verificar si el pool está disponible
    if (!pool) {
      return {
        success: false,
        message: 'Servicio de autenticación no disponible'
      };
    }

    const { nombre, email, password } = data;
    
    // Validar dominio de email
    if (!email.endsWith('@avaldigitallabs.com')) {
      return {
        success: false,
        message: 'Solo se permiten emails del dominio @avaldigitallabs.com'
      };
    }

    // Verificar si el email ya existe
    const [existingUsers] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    
    if ((existingUsers as any[]).length > 0) {
      return {
        success: false,
        message: 'Este email ya está registrado'
      };
    }

    // Hashear password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
      // Insertar usuario
      const [result] = await pool.execute(
        'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
        [nombre, email, passwordHash]
      );

      const insertResult = result as { insertId: number };
      
      // Obtener usuario creado
      const [userRows] = await pool.execute(
        'SELECT id, nombre, email, fecha_registro, activo FROM usuarios WHERE id = ?',
        [insertResult.insertId]
      );
      
      const usuario = (userRows as Usuario[])[0];

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        usuario
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  },

  // Iniciar sesión
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Verificar si el pool está disponible
    if (!pool) {
      return {
        success: false,
        message: 'Servicio de autenticación no disponible'
      };
    }

    const { email, password } = data;

    try {
      // Buscar usuario por email
      const [userRows] = await pool.execute(
        'SELECT id, nombre, email, password_hash, fecha_registro, activo FROM usuarios WHERE email = ? AND activo = true',
        [email]
      );

      const users = userRows as (Usuario & { password_hash: string })[];
      
      if (users.length === 0) {
        return {
          success: false,
          message: 'Email o contraseña incorrectos'
        };
      }

      const user = users[0];

      // Verificar password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return {
          success: false,
          message: 'Email o contraseña incorrectos'
        };
      }

      // Remover password_hash del objeto usuario
      const { password_hash, ...usuario } = user;

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        usuario
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  },

  // Obtener usuario por ID
  async getUserById(id: number): Promise<Usuario | null> {
    // Verificar si el pool está disponible
    if (!pool) {
      return null;
    }

    try {
      const [userRows] = await pool.execute(
        'SELECT id, nombre, email, fecha_registro, activo FROM usuarios WHERE id = ? AND activo = true',
        [id]
      );

      const users = userRows as Usuario[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Validar email de dominio
  isValidDomain(email: string): boolean {
    return email.endsWith('@avaldigitallabs.com');
  }
}; 