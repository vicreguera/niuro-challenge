"""Builds Fundo design tokens (DTCG JSON + CSS variables) and checks WCAG contrast.
Rules (set by the UX Lead):
- Primary #0E90E4 is step 500; the scale moves lightness ±10 per step (50 is a half step for subtle surfaces).
- Neutrals use the primary hue at low saturation; semantic colours (success, error, warning) use the same ladder.
- Headings: Outfit. Text: Roboto. Type scale in rem, base 1rem = 16px.
"""
import colorsys, json, sys

def hex2rgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def rgb2hex(c): return '#%02X%02X%02X'%tuple(round(max(0,min(1,x))*255) for x in c)
def fromhsl(H,S,L): return rgb2hex(colorsys.hls_to_rgb(H/360,L/100,S/100))
def lum(h):
    f=lambda x: x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4
    r,g,b=(f(x) for x in hex2rgb(h)); return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b):
    x,y=sorted([lum(a),lum(b)],reverse=True); return (x+0.05)/(y+0.05)

H0,S0,L0 = 203.55,88.43,47.45   # #0E90E4
LADDER={'50':L0+47.5,'100':L0+40,'200':L0+30,'300':L0+20,'400':L0+10,'500':L0,'600':L0-10,'700':L0-20,'800':L0-30,'900':L0-40}
FAMILIES={'primary':(H0,S0),'neutral':(H0,14),'success':(145,68),'error':(0,72),'warning':(38,92)}
P={f:{k:fromhsl(h,s,l) for k,l in LADDER.items()} for f,(h,s) in FAMILIES.items()}
P['primary']['500']='#0E90E4'
P['neutral']={'0':'#FFFFFF',**P['neutral']}

ref=lambda f,k:'{color.%s.%s}'%(f,k)
# semantic: name -> (light ref, dark ref)
SEM={
 'surface.page':            (('neutral','50'),  ('neutral','900')),
 'surface.default':         (('neutral','0'),   ('neutral','800')),
 'surface.sunken':          (('neutral','100'), ('neutral','900')),
 'surface.raised':          (('neutral','0'),   ('neutral','700')),
 'surface.inverse':         (('neutral','900'), ('neutral','50')),
 'text.primary':            (('neutral','900'), ('neutral','50')),
 'text.secondary':          (('neutral','700'), ('neutral','200')),
 'text.tertiary':           (('neutral','600'), ('neutral','300')),
 'text.disabled':           (('neutral','400'), ('neutral','500')),
 'text.inverse':            (('neutral','0'),   ('neutral','900')),
 'text.link':               (('primary','600'), ('primary','300')),
 'border.default':          (('neutral','200'), ('neutral','700')),
 'border.strong':           (('neutral','400'), ('neutral','400')),
 'border.focus':            (('primary','500'), ('primary','300')),
 'brand.primary':           (('primary','500'), ('primary','400')),
 'action.primary':          (('primary','600'), ('primary','400')),
 'action.primary-hover':    (('primary','700'), ('primary','300')),
 'action.primary-pressed':  (('primary','800'), ('primary','200')),
 'on.action-primary':       (('neutral','0'),   ('neutral','900')),
 'action.disabled':         (('neutral','100'), ('neutral','700')),
 'on.action-disabled':      (('neutral','400'), ('neutral','400')),
 'primary.subtle':          (('primary','50'),  ('primary','900')),
 'on.primary-subtle':       (('primary','800'), ('primary','100')),
}
for f,(solid_l,solid_d,on_l,on_d,text_l,text_d) in {
    'success':('700','400',('neutral','0'),('neutral','900'),'700','300'),
    'error':  ('600','300',('neutral','0'),('neutral','900'),'600','300'),
    'warning':('400','400',('neutral','900'),('neutral','900'),'700','300')}.items():
    SEM[f'{f}.solid']=((f,solid_l),(f,solid_d))
    SEM[f'on.{f}-solid']=(on_l,on_d)
    SEM[f'{f}.text']=((f,text_l),(f,text_d))
    SEM[f'{f}.subtle']=((f,'50'),(f,'900'))
    SEM[f'on.{f}-subtle']=((f,'800'),(f,'100'))
    SEM[f'{f}.border']=((f,'300'),(f,'700'))

# contrast checks: (fg, bg, minimum)
CHECKS=[('text.primary','surface.default',4.5),('text.primary','surface.page',4.5),
 ('text.secondary','surface.default',4.5),('text.secondary','surface.page',4.5),
 ('text.tertiary','surface.default',4.5),('text.tertiary','surface.page',4.5),
 ('text.link','surface.default',4.5),('text.link','surface.page',4.5),
 ('on.action-primary','action.primary',4.5),('on.action-primary','action.primary-hover',4.5),
 ('border.strong','surface.default',3.0),('border.focus','surface.default',3.0),
 ('brand.primary','surface.default',3.0),('on.primary-subtle','primary.subtle',4.5)]
for f in ('success','error','warning'):
    CHECKS+=[(f'on.{f}-solid',f'{f}.solid',4.5),(f'{f}.text','surface.default',4.5),(f'on.{f}-subtle',f'{f}.subtle',4.5)]

def val(name,mode):
    f,k=SEM[name][0 if mode=='light' else 1]; return P[f][k]

report=[]; fails=0
for mode in ('light','dark'):
    for fg,bg,mn in CHECKS:
        r=cr(val(fg,mode),val(bg,mode)); ok=r>=mn; fails+=not ok
        report.append((mode,fg,bg,round(r,2),mn,ok))

TYPE={ # name: family, size rem, line-height, weight, mobile size rem
 'display':('heading',3,1.1,700,2.5),'heading-1':('heading',2.25,1.15,700,2),
 'heading-2':('heading',1.75,1.2,700,1.5),'heading-3':('heading',1.375,1.3,600,1.25),
 'heading-4':('heading',1.125,1.35,600,1.125),'amount':('heading',2,1.1,600,1.75),
 'body-lg':('text',1.125,1.55,400,1.125),'body':('text',1,1.5,400,1),
 'body-sm':('text',0.875,1.45,400,0.875),'label':('text',0.875,1.3,500,0.875),
 'caption':('text',0.75,1.35,400,0.75)}
SPACE={'0':0,'1':0.25,'2':0.5,'3':0.75,'4':1,'5':1.25,'6':1.5,'8':2,'10':2.5,'12':3,'16':4}
RADIUS={'none':0,'sm':0.25,'md':0.5,'lg':1,'xl':1.5,'full':999}

def dtcg():
    t={'color':{f:{k:{'$type':'color','$value':v} for k,v in sc.items()} for f,sc in P.items()}}
    t['font']={'family':{'heading':{'$type':'fontFamily','$value':['Outfit','system-ui','sans-serif']},
                        'text':{'$type':'fontFamily','$value':['Roboto','system-ui','sans-serif']}}}
    t['typography']={n:{'$type':'typography','$value':{'fontFamily':'{font.family.%s}'%fam,'fontSize':f'{s}rem',
        'lineHeight':lh,'fontWeight':w},'$extensions':{'fundo.mobileFontSize':f'{m}rem'}} for n,(fam,s,lh,w,m) in TYPE.items()}
    t['typography']['amount']['$extensions']['fundo.fontVariantNumeric']='tabular-nums'
    t['space']={k:{'$type':'dimension','$value':f'{v}rem'} for k,v in SPACE.items()}
    t['radius']={k:{'$type':'dimension','$value':('9999px' if k=='full' else f'{v}rem')} for k,v in RADIUS.items()}
    for mode,i in (('light',0),('dark',1)):
        node=t.setdefault('semantic',{}).setdefault(mode,{})
        for name,refs in SEM.items():
            g,leaf=name.split('.',1); f,k=refs[i]
            node.setdefault(g,{})[leaf]={'$type':'color','$value':ref(f,k)}
    return t

def css():
    L=[':root {']
    for f,sc in P.items():
        for k,v in sc.items(): L.append(f'  --color-{f}-{k}: {v};')
    L+=["  --font-heading: 'Outfit', system-ui, sans-serif;","  --font-text: 'Roboto', system-ui, sans-serif;"]
    for n,(fam,s,lh,w,m) in TYPE.items():
        L+=[f'  --type-{n}-family: var(--font-{fam});',f'  --type-{n}-size: {m}rem;',f'  --type-{n}-line-height: {lh};',f'  --type-{n}-weight: {w};']
    for k,v in SPACE.items(): L.append(f'  --space-{k}: {v}rem;')
    for k,v in RADIUS.items(): L.append(f'  --radius-{k}: '+('9999px' if k=='full' else f'{v}rem')+';')
    sem=lambda i:[f'  --{n.replace(".","-")}: var(--color-{SEM[n][i][0]}-{SEM[n][i][1]});' for n in SEM]
    L+=sem(0)+['  color-scheme: light;','}','',
        '/* Desktop type sizes (mobile-first: the defaults above are the phone sizes) */','@media (min-width: 48rem) {','  :root {']
    L+=[f'    --type-{n}-size: {s}rem;' for n,(fam,s,lh,w,m) in TYPE.items() if s!=m]+['  }','}','',
        '/* Dark mode: follows the OS unless a theme is forced with data-theme */',
        '@media (prefers-color-scheme: dark) {',"  :root:not([data-theme='light']) {"]
    L+=['  '+x for x in sem(1)]+['    color-scheme: dark;','  }','}',"",
        "/* Forced themes: on <html> or on any container (e.g. a design artboard) */",
        ":root[data-theme='dark'], [data-theme='dark'] {"]+sem(1)+['  color-scheme: dark;','}',"",
        ":root[data-theme='light'], [data-theme='light'] {"]+sem(0)+['  color-scheme: light;','}']
    return '\n'.join(L)+'\n'

if __name__=='__main__':
    json.dump(dtcg(),open('tokens/fundo.tokens.json','w'),indent=2)
    open('tokens/fundo.tokens.css','w').write(css())
    with open('tokens/contrast-report.md','w') as fh:
        fh.write('# Contrast report (generated by build_tokens.py)\n\n| Mode | Foreground | Background | Ratio | Min | Pass |\n|---|---|---|---|---|---|\n')
        for m,fg,bg,r,mn,ok in report: fh.write(f'| {m} | `{fg}` | `{bg}` | {r} | {mn} | {"✅" if ok else "❌"} |\n')
    print('fails:',fails)
    for m,fg,bg,r,mn,ok in report:
        if not ok: print('FAIL',m,fg,bg,r,mn)
