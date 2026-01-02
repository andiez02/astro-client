# Authentication Flow Documentation

## Tổng quan

Hệ thống sử dụng **Sign-In with Ethereum (SIWE)** để xác thực người dùng thông qua ví crypto (MetaMask, WalletConnect, etc.). Luồng authentication được tích hợp với **RainbowKit** và **Wagmi** để quản lý kết nối ví và xác thực.

## Kiến trúc

### Các thành phần chính

1. **Web3Provider** - Provider chính cho Web3 và authentication
2. **AuthService** - Service xử lý các API calls liên quan đến auth
3. **useAutoLogin** - Hook tự động đăng nhập khi ví được kết nối
4. **authenticationAdapter** - Adapter cho RainbowKit SIWE authentication
5. **Wagmi Config** - Cấu hình blockchain (Sepolia testnet)

---

## Luồng Authentication

### 1. Khởi tạo (Initialization)

```
App Layout
  └── Web3Provider
      ├── WagmiProvider (quản lý kết nối ví)
      ├── QueryClientProvider (React Query)
      ├── RainbowKitProvider (UI components)
      └── AutoLoginHandler
          └── useAutoLogin (hook tự động login)
```

**File:** `src/components/providers/Web3Provider.tsx`

- Cung cấp context cho toàn bộ app
- Tự động trigger auto-login khi ví được kết nối

---

### 2. Kết nối Ví (Wallet Connection)

**Bước 1:** Người dùng click vào `ConnectButton` (RainbowKit)

**Bước 2:** RainbowKit hiển thị modal chọn ví:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Các ví khác được hỗ trợ

**Bước 3:** Người dùng chấp nhận kết nối trong ví

**Bước 4:** Wagmi lưu trạng thái kết nối:
- `isConnected = true`
- `address` được lưu
- `chainId` được lưu

---

### 3. Auto-Login Flow (Tự động đăng nhập)

**File:** `src/common/hooks/useAutoLogin.ts`

Luồng tự động đăng nhập được trigger khi:
- Ví được kết nối (`isConnected = true`)
- Địa chỉ ví thay đổi
- Chain ID thay đổi

#### 3.1. Kiểm tra Token hiện tại

```typescript
const hasValidToken = api.auth.checkAuth();
```

**Logic:**
- Kiểm tra token trong `localStorage` (key: `astro_access_token`)
- Nếu token tồn tại và chưa hết hạn → Skip auto-login
- Nếu địa chỉ ví thay đổi → Logout session cũ

#### 3.2. Kiểm tra Chain ID

```typescript
if (chainId !== SEPOLIA_CHAIN_ID) {
  // Tự động chuyển sang Sepolia testnet
  await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID });
}
```

**Yêu cầu:** Phải ở trên Sepolia testnet (Chain ID: 11155111)

#### 3.3. Lấy Nonce từ Backend

**API Call:**
```typescript
GET /auth/nonce?address={address}
```

**Response:**
```json
{
  "data": {
    "nonce": "random-string-123"
  }
}
```

**File:** `src/services/controllers/auth/AuthService.ts` - `getNonce()`

#### 3.4. Tạo SIWE Message

**File:** `src/common/hooks/useAutoLogin.ts`

```typescript
const message = new SiweMessage({
  domain: window.location.host,        // Domain hiện tại
  address,                              // Địa chỉ ví
  statement: 'Sign in with Ethereum to Krypto Marketplace.',
  uri: window.location.origin,         // Origin URL
  version: '1',
  chainId: SEPOLIA_CHAIN_ID,           // 11155111
  nonce,                                // Nonce từ backend
});
```

**Message format:**
```
{domain} wants you to sign in with your Ethereum account:
{address}

{statement}

URI: {uri}
Version: {version}
Chain ID: {chainId}
Nonce: {nonce}
Issued At: {timestamp}
```

#### 3.5. Ký Message với Ví

```typescript
const signature = await signMessageAsync({ message: messageString });
```

**Quá trình:**
- Wagmi hiển thị popup yêu cầu ký message
- Người dùng xác nhận trong ví (MetaMask popup)
- Ví trả về signature (chuỗi hex)

#### 3.6. Verify và Lấy Access Token

**API Call:**
```typescript
POST /auth/login
Body: {
  "message": "SIWE message string",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "data": {
    "accessToken": "jwt-token-here"
  }
}
```

**File:** `src/services/controllers/auth/AuthService.ts` - `login()`

**Backend xử lý:**
1. Verify signature với địa chỉ ví
2. Verify nonce còn hợp lệ
3. Verify domain và chain ID
4. Tạo JWT token
5. Trả về access token

#### 3.7. Lưu Token

```typescript
api.auth.saveToken(accessToken);
```

**Storage:** `localStorage.setItem('astro_access_token', token)`

**File:** `src/services/controllers/auth/AuthService.ts` - `saveToken()`

---

### 4. Manual Login Flow (RainbowKit SIWE)

**File:** `src/config/authAdapter.ts`

Ngoài auto-login, người dùng có thể đăng nhập thủ công thông qua RainbowKit's authentication modal.

#### 4.1. getNonce()

```typescript
getNonce: async () => {
  const account = getAccount(config);
  if (!account.address) {
    throw new Error('Wallet not connected');
  }
  const nonce = await api.auth.getNonce(account.address);
  return nonce;
}
```

#### 4.2. createMessage()

```typescript
createMessage: ({ nonce, address, chainId }) => {
  return new SiweMessage({
    domain: window.location.host,
    address,
    statement: 'Sign in with Ethereum to Krypto Marketplace.',
    uri: window.location.origin,
    version: '1',
    chainId,
    nonce,
  });
}
```

#### 4.3. verify()

```typescript
verify: async ({ message, signature }) => {
  const siweMessage = message as SiweMessage;
  const messageString = siweMessage.prepareMessage();
  
  const { accessToken } = await api.auth.login(messageString, signature);
  api.auth.saveToken(accessToken);
  
  return true;
}
```

#### 4.4. signOut()

```typescript
signOut: async () => {
  api.auth.logout();
}
```

---

### 5. Token Management

**File:** `src/services/controllers/auth/AuthService.ts`

#### 5.1. Lưu Token
```typescript
saveToken(token: string): void
```
- Lưu vào `localStorage` với key `astro_access_token`

#### 5.2. Lấy Token
```typescript
getToken(): string | null
```
- Đọc từ `localStorage`

#### 5.3. Kiểm tra Token
```typescript
checkAuth(): boolean
```
- Kiểm tra token có tồn tại
- Nếu là JWT, kiểm tra expiration time
- Trả về `true` nếu token hợp lệ

#### 5.4. Xóa Token
```typescript
logout(): void
```
- Xóa token khỏi `localStorage`

---

### 6. API Client Configuration

**File:** `src/services/apiClient.ts`

**Base Configuration:**
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Timeout: 15000ms
- Request interceptor: Thêm `Cache-Control: no-cache`
- Response interceptor: Xử lý errors

**File:** `src/services/apiService.ts`
- Export singleton instance `api`
- Cung cấp `api.auth` để gọi các method authentication

---

## Sequence Diagram

```
User                    Wallet              Frontend              Backend
 |                       |                      |                      |
 |--[Click Connect]----->|                      |                      |
 |                       |--[Connect Request]-->|                      |
 |                       |<--[Approved]---------|                      |
 |                       |                      |                      |
 |                       |                      |--[GET /auth/nonce]-->|
 |                       |                      |<--[nonce]------------|
 |                       |                      |                      |
 |                       |<--[Sign Message]-----|                      |
 |--[Approve Sign]------>|                      |                      |
 |                       |--[signature]-------->|                      |
 |                       |                      |                      |
 |                       |                      |--[POST /auth/login]->|
 |                       |                      |<--[accessToken]------|
 |                       |                      |                      |
 |                       |                      |[Save to localStorage]|
```

---

## Các trường hợp xử lý

### 1. Token đã tồn tại và hợp lệ
- **Hành động:** Skip auto-login
- **Logic:** Kiểm tra `checkAuth()` trước khi thực hiện login

### 2. Địa chỉ ví thay đổi
- **Hành động:** Logout session cũ, login với địa chỉ mới
- **Logic:** So sánh `lastAddress.current` với `address` hiện tại

### 3. Sai Chain ID
- **Hành động:** Tự động chuyển sang Sepolia testnet
- **Logic:** Kiểm tra `chainId !== SEPOLIA_CHAIN_ID` và gọi `switchChainAsync()`

### 4. Lỗi trong quá trình login
- **Hành động:** Reset `isLoggingIn` flag, log error
- **Logic:** Try-catch trong `performLogin()`, cleanup trong `finally`

### 5. Ngăn chặn multiple login attempts
- **Cơ chế:** Sử dụng `useRef` để track `isLoggingIn` state
- **Logic:** Kiểm tra flag trước khi thực hiện login

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_PROJECT_ID=your-walletconnect-project-id
```

---

## Dependencies

- **@rainbow-me/rainbowkit**: UI components và SIWE adapter
- **wagmi**: React hooks cho Ethereum
- **siwe**: Sign-In with Ethereum message format
- **axios**: HTTP client
- **@tanstack/react-query**: Data fetching và caching

---

## Security Considerations

1. **Token Storage:** Token được lưu trong `localStorage` (có thể bị XSS attack)
   - **Cải thiện:** Cân nhắc dùng `httpOnly` cookies hoặc secure storage

2. **Nonce:** Mỗi nonce chỉ dùng một lần, có thời gian hết hạn
   - Backend phải verify nonce chưa được sử dụng

3. **Signature Verification:** Backend phải verify:
   - Signature khớp với address
   - Message domain/chain ID đúng
   - Nonce hợp lệ và chưa dùng

4. **JWT Expiration:** Token có expiration time, frontend check trước khi dùng

---

## Testing Flow

1. **Connect Wallet:**
   - Click ConnectButton
   - Chọn ví (MetaMask)
   - Approve connection

2. **Auto-Login:**
   - Kiểm tra console logs
   - Verify token được lưu vào localStorage
   - Refresh page, verify vẫn authenticated

3. **Manual Login:**
   - Disconnect wallet
   - Connect lại
   - Sử dụng RainbowKit auth modal

4. **Logout:**
   - Click logout button
   - Verify token bị xóa
   - Verify phải login lại

5. **Chain Switch:**
   - Switch sang chain khác
   - Verify tự động chuyển về Sepolia
   - Verify login vẫn hoạt động

---

## Troubleshooting

### Token không được lưu
- Kiểm tra `localStorage` có available không
- Kiểm tra browser có block localStorage không

### Auto-login không chạy
- Kiểm tra `isConnected` và `address` có giá trị không
- Kiểm tra `isLoggingIn` flag có bị stuck không
- Kiểm tra console logs để debug

### Signature verification failed
- Kiểm tra message format đúng chưa
- Kiểm tra chain ID đúng chưa
- Kiểm tra nonce còn hợp lệ không

### Chain switch failed
- Kiểm tra ví có hỗ trợ Sepolia không
- Kiểm tra user có approve chain switch không

