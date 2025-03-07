import supabase from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);
  
  if (!body.get('user')) throw createError({ statusMessage: 'You must be logged in to submit feedback.' });
  if (!body.get('profession')) throw createError({ statusMessage: 'Please provide your profession.' });
  if (!body.get('useful')) throw createError({ statusMessage: 'Please let us know if you find Accessible Web Media useful.' });
  if (!body.get('preferred_tool')) throw createError({ statusMessage: 'Please let us know which tool you are most likely to use.' });
  if (!body.get('would_pay')) throw createError({ statusMessage: 'Please let us know if this is a tool you would consider paying for.' });
  if (!body.get('works_well')) throw createError({ statusMessage: 'Please let us know what works well in Accessible Web Media.' });
  if (!body.get('can_improve')) throw createError({ statusMessage: 'Please let us know what we can improve in Accessible Web Media.' });
  if (!body.get('accessibility_knowledge')) throw createError({ statusMessage: 'Please let us know if you are interested in learning more about web accessibility.' });
  if (!body.get('receive_updates')) throw createError({ statusMessage: 'Please let us know if you would like to receive updates about Accessible Web Media.' });

  const userId = body.get('user');
  const profession = body.get('profession');
  const useful = body.get('useful') === 'Yes' ? true : false;
  const preferredTool = body.get('preferred_tool');
  const wouldPay = body.get('would_pay') === 'Yes' ? true : false;
  const worksWell = body.get('works_well');
  const canImprove = body.get('can_improve');
  const accessibilityKnowledge = body.get('accessibility_knowledge') === 'Yes' ? true : false;
  const receiveUpdates = body.get('receive_updates') === 'Yes' ? true : false;

  const { error} = await supabase.from('feedback').insert({
    user_id: userId,
    profession,
    useful,
    preferred_tool: preferredTool,
    would_pay: wouldPay,
    works_well: worksWell,
    can_improve: canImprove,
    accessibility_knowledge: accessibilityKnowledge,
    receive_updates: receiveUpdates
  });

  if (error) throw createError({ statusMessage: error.message });

  return sendRedirect(event, 'http://localhost:3000/feedback');
});