import os

filepath = r'apps\web\src\middleware.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_headers = """    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };"""

new_headers = """    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };"""

if old_headers in content:
    content = content.replace(old_headers, new_headers)
    # Also strip X-Powered-By
    old_set = """  Object.entries(securityHeaders).forEach(([key, value]) => {
    intlResponse.headers.set(key, value);
  });"""
    new_set = """  Object.entries(securityHeaders).forEach(([key, value]) => {
    intlResponse.headers.set(key, value);
  });
  
  intlResponse.headers.delete("X-Powered-By");"""
    
    if old_set in content:
        content = content.replace(old_set, new_set)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("SUCCESS UPDATE WEB MIDDLEWARE")
    else:
        print("old_set not found")
else:
    print("old_headers not found")
