import sys, html
sys.path.insert(0,'tokens')
from build_tokens import P, SEM, TYPE, SPACE, RADIUS, cr, val
css=open('tokens/fundo.tokens.css').read()
logo_g=open('brand/logos/fundo-logo-gradient.svg').read().replace('<svg ','<svg class="logo" role="img" aria-label="Fundo" ',1)
logo_w=open('brand/logos/fundo-logo-white.svg').read().replace('<svg ','<svg class="logo" role="img" aria-label="Fundo" ',1)
def swatches():
    out=[]
    for f,sc in P.items():
        cells=''.join(f'<div class="sw"><div class="chip" style="background:var(--color-{f}-{k})"></div><b>{k}</b><code>{v}</code><small>W {cr(v,"#FFFFFF"):.1f} · D {cr(v,P["neutral"]["900"]):.1f}</small></div>' for k,v in sc.items())
        out.append(f'<h3>{f}</h3><div class="row">{cells}</div>')
    return '\n'.join(out)
def semantic():
    rows=''.join(f'<tr><td><code>--{n.replace(".","-")}</code></td><td><span class="dot" style="background:{val(n,"light")}"></span>{SEM[n][0][0]}-{SEM[n][0][1]}</td><td><span class="dot" style="background:{val(n,"dark")}"></span>{SEM[n][1][0]}-{SEM[n][1][1]}</td></tr>' for n in SEM)
    return f'<table><thead><tr><th>Semantic token</th><th>Light</th><th>Dark</th></tr></thead><tbody>{rows}</tbody></table>'
def types():
    return ''.join(f'<div class="ty"><span class="meta">{n} · {"Outfit" if fam=="heading" else "Roboto"} {w} · {s}rem / {m}rem mobile</span><div style="font-family:var(--type-{n}-family);font-size:var(--type-{n}-size);line-height:var(--type-{n}-line-height);font-weight:var(--type-{n}-weight){";font-variant-numeric:tabular-nums" if n=="amount" else ""}">{"$2,600.00" if n=="amount" else "See what you’d pay back before you apply"}</div></div>' for n,(fam,s,lh,w,m) in TYPE.items())
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fundo Tokens</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<style>
{css}
*{{box-sizing:border-box}} body{{margin:0;background:var(--surface-page);color:var(--text-primary);font-family:var(--font-text);font-size:var(--type-body-size);line-height:var(--type-body-line-height)}}
header{{background:var(--surface-default);border-bottom:1px solid var(--border-default);padding:var(--space-4);display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);position:sticky;top:0;z-index:2}}
header .logo{{height:28px;width:auto}} main{{max-width:72rem;margin:0 auto;padding:var(--space-6) var(--space-4) var(--space-16)}}
h1,h2,h3{{font-family:var(--font-heading);margin:0 0 var(--space-3)}} h1{{font-size:var(--type-heading-1-size);line-height:var(--type-heading-1-line-height)}}
h2{{font-size:var(--type-heading-2-size);margin-top:var(--space-12)}} h3{{font-size:var(--type-heading-4-size);text-transform:capitalize;margin-top:var(--space-6)}}
p.lead{{color:var(--text-secondary);max-width:44rem}}
.row{{display:grid;grid-template-columns:repeat(auto-fill,minmax(6.5rem,1fr));gap:var(--space-2)}}
.sw{{background:var(--surface-default);border:1px solid var(--border-default);border-radius:var(--radius-md);padding:var(--space-2);display:flex;flex-direction:column;gap:2px;font-size:var(--type-caption-size)}}
.chip{{height:2.5rem;border-radius:var(--radius-sm);border:1px solid var(--border-default)}} .sw code{{font-size:.7rem}} .sw small{{color:var(--text-tertiary)}}
table{{width:100%;border-collapse:collapse;background:var(--surface-default);border-radius:var(--radius-lg);overflow:hidden;font-size:var(--type-body-sm-size)}}
th,td{{text-align:left;padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--border-default)}} th{{font-weight:500;color:var(--text-secondary)}}
.dot{{display:inline-block;width:1rem;height:1rem;border-radius:var(--radius-full);border:1px solid var(--border-strong);vertical-align:middle;margin-right:var(--space-2)}}
.tablewrap{{overflow-x:auto}}
.ty{{background:var(--surface-default);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:var(--space-4);margin-bottom:var(--space-2)}}
.meta{{display:block;font-size:var(--type-caption-size);color:var(--text-tertiary);margin-bottom:var(--space-1)}}
.grid2{{display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:var(--space-4)}}
.card{{background:var(--surface-default);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:var(--space-5)}}
.btn{{font:500 1rem/1 var(--font-text);border:0;border-radius:var(--radius-full);padding:0 var(--space-6);min-height:3rem;cursor:pointer;display:inline-flex;align-items:center;gap:var(--space-2)}}
.btn-primary{{background:var(--action-primary);color:var(--on-action-primary)}} .btn-primary:hover{{background:var(--action-primary-hover)}} .btn-primary:active{{background:var(--action-primary-pressed)}}
.btn-secondary{{background:transparent;color:var(--text-link);box-shadow:inset 0 0 0 1px var(--border-strong)}}
.btn:disabled{{background:var(--action-disabled);color:var(--on-action-disabled);cursor:not-allowed}}
.btn:focus-visible,input:focus-visible{{outline:3px solid var(--border-focus);outline-offset:2px}}
.btns{{display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center}} .help{{font-size:var(--type-body-sm-size);color:var(--text-tertiary);width:100%}}
label{{display:block;font-weight:500;font-size:var(--type-label-size);margin-bottom:var(--space-1)}}
input{{width:100%;font:1rem var(--font-text);padding:var(--space-3);border:1px solid var(--border-strong);border-radius:var(--radius-md);background:var(--surface-default);color:var(--text-primary)}}
input[aria-invalid=true]{{border-color:var(--error-solid)}} .err{{color:var(--error-text);font-size:var(--type-body-sm-size);margin-top:var(--space-1)}}
.quote dl{{display:grid;grid-template-columns:1fr auto;gap:var(--space-2) var(--space-4);margin:0}} .quote dt{{color:var(--text-secondary)}} .quote dd{{margin:0;text-align:right;font-variant-numeric:tabular-nums;font-weight:500}}
.quote .big{{font-family:var(--type-amount-family);font-size:var(--type-amount-size);font-weight:var(--type-amount-weight);line-height:1.1;color:var(--text-primary)}}
.quote hr{{border:0;border-top:1px solid var(--border-default);margin:var(--space-3) 0}} .fine{{font-size:var(--type-caption-size);color:var(--text-tertiary);margin-top:var(--space-3)}}
.alert{{border-radius:var(--radius-md);padding:var(--space-3) var(--space-4);border:1px solid;margin-bottom:var(--space-2);font-size:var(--type-body-sm-size)}}
.a-success{{background:var(--success-subtle);color:var(--on-success-subtle);border-color:var(--success-border)}}
.a-warning{{background:var(--warning-subtle);color:var(--on-warning-subtle);border-color:var(--warning-border)}}
.a-error{{background:var(--error-subtle);color:var(--on-error-subtle);border-color:var(--error-border)}}
.badges{{display:flex;gap:var(--space-2);flex-wrap:wrap}} .badge{{border-radius:var(--radius-full);padding:var(--space-1) var(--space-3);font-size:var(--type-label-size);font-weight:500}}
.logos{{display:flex;gap:var(--space-4);flex-wrap:wrap}} .logos div{{border-radius:var(--radius-lg);padding:var(--space-6);display:flex;align-items:center;justify-content:center;flex:1 1 14rem}}
.logos .logo{{width:100%;max-width:12rem;height:auto}}
.spacer{{display:flex;align-items:flex-end;gap:var(--space-3);flex-wrap:wrap}} .spacer div{{background:var(--brand-primary);border-radius:var(--radius-sm)}} .spacer span{{display:block;font-size:.7rem;color:var(--text-tertiary);text-align:center}}
.radii{{display:flex;gap:var(--space-3);flex-wrap:wrap}} .radii div{{width:4.5rem;height:3rem;background:var(--primary-subtle);border:1px solid var(--brand-primary);display:flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--on-primary-subtle)}}
#theme{{white-space:nowrap}}
</style></head><body>
<header>{logo_g}<button id="theme" class="btn btn-secondary" type="button" aria-pressed="false">Dark mode</button></header>
<main>
<h1>Fundo design tokens</h1>
<p class="lead">Built from the fundo.com brand: Outfit for headings, Roboto for text, primary <code>#0E90E4</code>. Every scale moves lightness ±10 per step from its 500; neutrals take the primary’s hue. Semantic tokens map each role to a step for light and dark mode, and every text/background pair is checked against WCAG AA by the build script.</p>

<h2>Logo</h2>
<div class="logos"><div style="background:var(--surface-default);border:1px solid var(--border-default)">{logo_g}</div><div style="background:var(--color-primary-700)">{logo_w}</div><div style="background:var(--color-neutral-900)">{logo_w}</div></div>

<h2>Primitive palette</h2>
<p class="lead">W = contrast against white, D = against neutral‑900. #0E90E4 reaches only 3.4:1 on white, so it is the <b>brand</b> colour (logo, large headings, icons, focus); actions and links use primary‑600 (5.2:1).</p>
{swatches()}

<h2>Semantic tokens</h2>
<div class="tablewrap">{semantic()}</div>

<h2>Type scale</h2>
<p class="lead">rem‑based (1rem = 16px), mobile‑first: phone sizes by default, desktop sizes from 48rem. <code>amount</code> uses tabular numbers so figures line up.</p>
{types()}

<h2>Spacing and radius</h2>
<div class="spacer">{"".join(f'<div style="width:var(--space-{k});height:var(--space-{k})"></div><span>{k}</span>' for k in SPACE if k!='0')}</div>
<div class="radii" style="margin-top:var(--space-4)">{"".join(f'<div style="border-radius:var(--radius-{k})">{k}</div>' for k in RADIUS)}</div>

<h2>Tokens in use</h2>
<div class="grid2">
<div class="card"><h3 style="margin-top:0">Actions</h3><div class="btns"><button class="btn btn-primary">Check if I can apply</button><button class="btn btn-secondary">Change</button><button class="btn btn-primary" disabled aria-describedby="h1">Continue</button><span class="help" id="h1">Answer all three to continue</span></div>
<div style="margin-top:var(--space-5)"><label for="em">Where should we send your quote?</label><input id="em" value="name@example" aria-invalid="true" aria-describedby="e1"><div class="err" id="e1">Enter a valid email, like name@example.com.</div></div></div>
<div class="card quote"><h3 style="margin-top:0">Quote card</h3><dl><dt>You get</dt><dd class="big">$2,000</dd><dt>You pay back</dt><dd class="big">$2,600</dd></dl><hr><dl><dt>16 weekly payments</dt><dd>$162.50</dd><dt>Payment day</dt><dd>Tuesday</dd><dt>Cost of this advance</dt><dd>$600.00</dd></dl><p class="fine">Example based on typical pricing. Your real offer depends on your deposits. Not a loan. Not available in CA or NY.</p></div>
<div class="card"><h3 style="margin-top:0">Feedback</h3><div class="alert a-success">Good news — you can apply.</div><div class="alert a-warning">Still working — slow connection. Your answers are saved.</div><div class="alert a-error">We couldn’t reach Fundo. Check your connection and try again.</div>
<div class="badges"><span class="badge" style="background:var(--success-solid);color:var(--on-success-solid)">Funded</span><span class="badge" style="background:var(--warning-solid);color:var(--on-warning-solid)">Payment due</span><span class="badge" style="background:var(--error-solid);color:var(--on-error-solid)">Payment failed</span><span class="badge" style="background:var(--primary-subtle);color:var(--on-primary-subtle)">In review</span></div></div>
</div>
</main>
<script>
const b=document.getElementById('theme'),r=document.documentElement;
function cur(){{const t=r.getAttribute('data-theme');return t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}}
function paint(){{const d=cur()==='dark';b.textContent=d?'Light mode':'Dark mode';b.setAttribute('aria-pressed',String(d))}}
b.addEventListener('click',()=>{{r.setAttribute('data-theme',cur()==='dark'?'light':'dark');paint()}});paint();
</script></body></html>'''
open('tokens/specimen.html','w').write(page)
print(len(page))
