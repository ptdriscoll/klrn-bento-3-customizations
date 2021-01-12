# -*- coding: utf-8 -*-
"""
Created on Fri Feb 09 19:12:21 2018

@author: pdriscoll
"""

import os

folder = '//nova\Forms & Lists/Education- The Healthy Kids Project/Documents from the Website/FINAL Lesson Files/'
folder = 'J:/Education\Education- The Healthy Kids Project/Documents from the Website/FINAL Lesson Files'

lesson_subheads = [  
    'Lesson 1: We Have Bodies (English)',
    'Lesson 1: We Have Bodies (Bilingual)',
    'Lesson 2: Hello, Body (English)',
    'Lesson 2: Hello, Body (Bilingual)',
    'Lesson 3: Sugar: Master of Disguise (English)',
    'Lesson 3: Sugar: Master of Disguise (Bilingual)',
    'Lesson 4: The Couch Potato Blues (English)',
    'Lesson 4: The Couch Potato Blues (Bilingual)',
    'Lesson 5: (Not About) Perfection (English)',
    'Lesson 5: (Not About) Perfection (Bilingual)  ' , 
    'Lesson 6: Help Each Other (English)',
    'Lesson 6: Help Each Other (Bilingual)',
    'Lesson 7: The Water Song (English)',
    'Lesson 7: The Water Song (Bilingual)',
    'Lesson 8: Foods That Grow (English)',
    'Lesson 8: Foods That Grow (Bilingual)',
    'Lesson 9: Healthy Choices A to Z (English)',
    'Lesson 9: Healthy Choices A to Z (Bilingual)',
    'Lesson 10: Health Feels Great (English)',
    'Lesson 10: Health Feels Great (Bilingual)'
] 

web_root = 'https://pbs.klrn.org/bento/downloads/healthy-kids/'

html = '<div class="text-container">\n\n'
html += '<p>Teaching even one child the importance of caring for the body can positively impact generations to come.</p>'
html += '\n\n'

#break files into content groups
family = []
quick_start = []
pre_k = []
lessons = []

for root, dirs, files in os.walk(folder):
    for fname in files:
        if fname.endswith('.pdf'):
             fname = fname[:-4]
             if fname.startswith('0'): quick_start.append(fname) 
             if fname.startswith('F'): family.append(fname) 
             if fname.startswith('K'): pre_k.append(fname) 
             if fname.startswith('L'): lessons.append(fname) 

family = sorted(family, key=lambda x: int(x.split('_')[1][1:]))
pre_k = sorted(pre_k, key=lambda x: int(x.split('_')[1][1:]))
lessons = sorted(lessons, key=lambda x: int(x.split('_')[0][1:]))

#all content within <p> tags have the same format
def build_graph(link, text):
    s = '<a href="' + web_root + link + '.pdf" target="_blank">'
    s += text + '</a><br />'
    return s

#function to build html for generic groups 
def build_group(title, group):
    html = '<p>'
    html += '<strong>' + title + '</strong><br />\n'
        
    for name in group:
        text = name.split('_', 2)[2]
        text = text.replace('_', ': ', 1)
        text = text.replace('_', ' ')
        html += build_graph(name, text)
    
    html += '</p>\n\n'
    return html    

#build quick start group
html += '<p>'
for name in quick_start:
    text = name[2:].replace('_', ' ')
    html += build_graph(name, text)
html += '</p>\n\n'

#build Family group
title = 'NEW! Family Lesson Plans'
html += build_group(title, family)

#build Pre-K group
title = 'NEW! Prekindergarten Lesson Plans (English)'
html += build_group(title, pre_k)
    
#build lessons group
subheads_index = 0
for name in lessons:
    data = name.split('_', 2)
   
    if data[2].startswith('Lesson'):
        text = data[2].replace('Lesson_Plan_', 'Lesson Plan: ')
        if subheads_index > 0: html += '</p>\n\n' 
        html += '<p><strong> ' + lesson_subheads[subheads_index] + ' </strong><br />\n'
        subheads_index += 1
    else: 
        text = data[2].replace('_', ': ', 1)
        
    text = text.replace('_', ' ')       
    html += build_graph(name, text)
    
html += '</p>\n\n</div><!--end .text-container-->\n\n'    

print ''
print html    
    
with open('healthy-kids-lesson-plans.htm', 'w') as f:
    f.write(html)

print ''
#print html






