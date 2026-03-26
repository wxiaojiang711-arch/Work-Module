import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }
    if (!password.trim()) {
      alert('请输入密码');
      return;
    }
    console.log('登录请求:', { username, password, remember });
    navigate('/knowledge/base-management');
  };

  return (
    <div className={styles.body}>
      <div className={styles.loginContainer}>
        <div className={styles.brandSection}>
          <h1 className={styles.brandTitle}>九龙坡区工作模块<br />数字化平台</h1>
          <p className={styles.brandDesc}>建立大成集智机制，推动中心工作方式从"碎片化"向"一体化"跃升，实现全区各级各部门工作模块全覆盖。</p>
        </div>

        <div className={styles.loginCard}>
          <h2>用户登录</h2>
          <p className={styles.subtitle}>请输入您的账号信息登录系统</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username">用户名</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24">
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
                </svg>
                <input type="text" id="username" placeholder="请输入用户名" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">密码</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <input type="password" id="password" placeholder="请输入密码" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                记住密码
              </label>
            </div>

            <button type="submit" className={styles.btnLogin}>
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
