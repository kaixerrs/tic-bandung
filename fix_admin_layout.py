import os

filepath = r'apps\admin\src\components\admin\AdminLayoutWrapper.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """          <NavGroup title="Informasi" id="informasi">
            <Link href="/admin/informasi/tentang-kami" className={navLinkClass('/admin/informasi/tentang-kami')}>"""

replacement = """          <NavGroup title="Informasi" id="informasi">
            <Link href="/admin/faq" className={navLinkClass('/admin/faq')}>
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Manajemen FAQ</span>
            </Link>
            <Link href="/admin/informasi/tentang-kami" className={navLinkClass('/admin/informasi/tentang-kami')}>"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS UPDATE ADMIN LAYOUT")
else:
    print("TARGET NOT FOUND")
