import { tesloApi } from '../../config/api/tesloApi';
import { User } from '../../domain/entities/user';
import type { AuthResponse, SRRAuthResponse } from '../../infrastructure/interfaces/auth.responses';


const returnUserToken = (data: SRRAuthResponse) => {

  const user: User = {
    id: data.user.id,
    email: data.user.email,
    full_name: data.user.full_name,
    is_active: data.user.is_active,
    is_superuser: data.user.is_superuser,
  }

  return {
    user: user,
    token: data.access_token,
  }
}



export const authLogin = async (email: string, password: string) => {
  const username = email.toLowerCase();

  try {
    const { data } = await tesloApi.post<SRRAuthResponse>('/login/access-token/', {
      username,
      password,
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return returnUserToken(data);
  } catch (error: unknown) {
    // Manejo de errores adecuado
    console.error("Error during login:", error);
    return null;
  }
};


export const authCheckStatus = async () => {

  try {
    const { data } = await tesloApi.get<SRRAuthResponse>('/auth/check-status');
    return returnUserToken(data);

  } catch (error) {
    console.log({ error });
    return null;
  }

}
