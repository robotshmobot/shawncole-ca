---
title: fairstone
description: Operating model, change program, and governance for a contact centre's first production AI deployment
date: 2026-06-18
tags:
  - AI-Enablement
  - strategy
image: /img/fairstone-op-model_0_20260618A.jpg
hideTitle: false
---

| 93%                                               | 46s            | $3M                               |
| ------------------------------------------------- | -------------- | --------------------------------- |
| adoption across the pilot cohort over seven weeks | saved per call | projected savings over five years |

I came in to lead three GenAI pilots and write an operating model for AI innovation at Fairstone, a Canadian non-prime consumer lender mid-merger. The proposed shape was 80% pilots, 20% operating model. Four weeks in, the ratio inverted.

The contact centre VP had spent nine months painstakingly trying to get IT to integrate AI call summaries from a vendor. IT cycles were committed to the merger and thus he made no progress. But, pilots were possible. The conditions determining whether *any* AI deployment happened (approval architecture, risk posture, vendor governance) were all in the way. We got the pilots to ship, however, what I'd learn about the organization while running them was the larger question.

We built Magic Autofill, a tool that automated the agent's most annoying and repetitive task, in three days. Approval to deploy it took eight weeks.

The conditions for approval were opaque to us and they emerged over weeks of meetings. The risks raised pertained to scaled production tooling, not a 15 agent pilot. This pattern repeated across every move from hidden processes and opaque approval gates, to risk mitigation calibrated for production scale. The cumulative effect was missing an October deadline before the contact centre busy season, pushing live deployment to January. Thus, every approval we navigated became material for the operating model.

![Shawn standing at a whiteboard facilitating a workshop with Fairstone agent managers](/img/fairstone-op-model_1_20260618A.jpg)
`Facilitation jazz hands — building AI trust with Fairstone managers`
## What I found sitting in the contact centre

Most of the depth came from sitting with agents in Montréal across multiple observation sessions, time-series analysis, interviews with managers and the agent trainer, and shadowing their workflow. The first non-obvious finding was agents taking notes outside their allotted after-call wrap time. Some so they wouldn't forget. Others to engineer a small break before the next call. They were already saving handle time in a way the system didn't measure.

The notes themselves were load-bearing. Agents implicitly use them to communicate with each other. On any callback, the next agent reads them to understand prior state. Critically, the notes capture *what the customer and the agent never talked about*. None of it gets summarized by a model trained on the call transcript. And QA scores agents on note quality, so agents who relied on AI summaries got marked down for the work the AI couldn't see.

AI summaries technically worked, but Fairstone needed to change its notes policy before the technology could land—so that's what I recommended. The most engrained behaviour in the contact centre, trained from day one, was the thing the technology had to negotiate with.

Two other field observations turned into the use cases. Agents were acting as a human API, copying customer information manually between disconnected systems. That became **Magic Autofill**. And agents were rejecting the internal knowledge base, pinging a group chat for context-specific answers instead. That third one became the engagement's most interesting cut.

![Furious late evening whiteboard strategy session](/img/fairstone-op-model_2_20260618A.jpg)
`Furious late evening whiteboard strategy session to kill UC3`
## The cut

A stakeholder pushed an internal chatbot as the answer to the knowledge-base problem for use case 3. Instead of arguing against it, I ran a limited test with two managers and two agents. The chatbot introduced confusion, eroded trust, and sent agents back to the group chat anyway. After wargaming time/effort/reward, I took the recommendation to steerco to kill use case 3 and concentrate runway on what we could feasibly pilot in the first two use cases. Steerco agreed. The trade-off itself became part of the operating model's argument for why the approval conditions had to change.

## Change as architecture

The change program I built started in the service design, crafted from what I observed on the ground. Three things mattered more than the rest.

#### Reprogramming the managers
The pre-existing management style was authoritative—reinforcement happened with a stick. I ran an AI trust workshop (that's me above, with the jazz hands) where the managers' real concerns came out… AI would make agents lazy. AI would erode the note quality they'd coached for years. These were legitimate concerns reinforced by the policies they had set since day 1. Through training and deployment I worked with managers individually to move them from criticism toward coaching—powered by AI synthesis of individual agent adoption, with custom coaching guidance.

#### Altering the measurement system during the pilot
Working with the director, I got leadership to ease some metrics agents were graded on during pilot phase. This was the structural anchor that made cultural change possible. You can't ask managers to coach test-and-learn while continuing to grade agents on the metrics that punish it.

#### The agent trainer as key lever
Most consultants would have run change through the management layer. I ran it through the agent trainer, the person who shapes how every new agent learns the work and the in-house authority on what counts as good. Her participation was the difference between agents trying the tools and trusting them, because they trusted her.

## Outcomes

**93% adoption** of Magic Autofill and AI Summaries across 26 pilot agents over seven weeks. Voluntary use, not mandated.

**~46 seconds saved per call** against a combined 80-second target across both interventions. The variance among agents was explained almost entirely by individual adoption depth, tenure, and cultural nuance.

**$3M projected savings over five years**, modelled jointly with the contact centre VP from productivity time saved across handle and admin time.

**Pilot handoff with named owners.** The handoff was a workshopped plan, not just a document. The director, the agent trainer, and the managers closest to the pilot are still running it because we didn't leave until they were ready to.

**New VP of Innovation hired to transform how shit gets built.** The operating model, a separate piece of work, aggregated our research, observation, and synthesis into strategic recommendations and plans on how the broader business could take the learnings from us embedded trying to make pilots happen, into holistic operational change toward a more ready and capable business. The new VP's role and mandate is to assemble a crew to realize these enterprise shifting strategies over the course of 3-5 years.

## What I'd do differently

- Push back on the vendor relationship earlier. Their inability to meet timing was the proximate cause of the missed October deadline and the structural cause of cutting use case three.
- Push harder for tech capability earlier. The only lever against eight-week approval cycles is starting more capability tracks in parallel sooner, which only works if the resources are there.
- Spend more time sitting with agents one-on-one during onboarding. The agents I spent the most time with had the highest adoption and the most durable trust in the tools. I underweighted that as a resource-allocation question.

## What this engagement is now part of how I work

The more the world focuses on AI capability, the harder I focus on the people using it. *Adoption is ROI.* If the work isn't used, there's no ROI; if there's no ROI, the strategic initiative is a cost centre with an executive sponsor. KPIs, investment cases, and roadmaps are all downstream of whether the people doing the work choose to use what was built for them.

That choice gets made in the structures, habits, and measurement systems around them. The next time I take on an engagement like this, the operating model conversation starts in week one.