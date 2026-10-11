"""Refresh only the folder listing. Never downloads or edits media."""
import pathlib, json, gdown
root = pathlib.Path(__file__).resolve().parents[1]
listing = gdown.download_folder(id='1aIcI4n49DWd-KKT-ou5-17RD0ZuRp0OX', output=str(root / 'assets-raw'), quiet=True, skip_download=True)
if not listing:
    raise SystemExit('Drive listing unavailable. Existing catalog preserved.')
catalog=[]
for file in listing:
    fields=file._asdict() if hasattr(file,'_asdict') else vars(file)
    identifier=fields.get('id') or fields.get('file_id')
    local=fields.get('local_path') or fields.get('path')
    if not identifier or not local:
        raise SystemExit('Unexpected listing schema. Existing catalog preserved; update parser for this gdown version.')
    relative=pathlib.Path(local).relative_to(root/'assets-raw')
    category=relative.parts[0] if len(relative.parts)>1 else 'Other'
    category={'3D_CGI':'3D/CGI','Ai':'AI','Long form Video':'Long Form Video'}.get(category,category)
    catalog.append({'id':identifier,'name':relative.name,'category':category})
(root/'src/data/drive-catalog.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8')
print(f'{len(catalog)} entries listed; no media downloaded.')
