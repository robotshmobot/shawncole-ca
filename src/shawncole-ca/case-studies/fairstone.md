---
title: fairstone
description: How running two pilots exposed the operational transformation a regulated lender needed before AI could land
date: 2026-06-18
tags:
  - AI-Enablement
  - strategy
image: /img/fairstone-op-model_0_20260618A.jpg
hideTitle: false
color: "#CBC2D3"
customStyles: |-
  .detail__content h4 {
    font-family: 'Geist Mono', sans-serif;
    text-transform: uppercase;
  }
---

| 93%                                               | 46s            | $3M                               |
| ------------------------------------------------- | -------------- | --------------------------------- |
| adoption across the pilot cohort over seven weeks | saved per call | projected savings over five years |

I came in to lead GenAI pilots at Fairstone, a Canadian consumer lender mid-merger. The proposed shape was 80% pilots, 20% operating model for operational efficiency. Four weeks in, the ratio inverted. The pilots were still the work, but they surfaced the real constraint on AI adoption was the delivery model, not the technology.

Fairstone's contact centre VP had spent nine months trying to get IT to integrate AI call summaries from a vendor. IT cycles were committed to the merger, so frustratingly for him, no progress. Pilots were possible, though; they required minimal infrastructure and sidestepped the formal intake queue. So we ran them, and each one became a diagnostic instrument for understanding what the challenge was in shipping AI at production scale.

## Takeoff

In-depth discovery and co-creation with the BU identified three viable use cases, and in implementing them, we uncovered the operational realities within:

**AI Summaries** was framed as a cost-reduction play: a top-down target to reduce handle time—something the agents adhered to greatly. This caused adoption to split understandably. High adopters saved 37 seconds per call. Low adopters lost 14 seconds. That 51-second difference was explained by individual adoption depth, tenure, and how agents experienced the tool relative to their existing workflow. Technology wasn't the variable… or rather it wasn't the primary one.

Conversely, **Magic Autofill** solved a problem agents already felt. They were acting as a human API, copying customer data between siloed systems on every call. We built the tool in three days. Approval to deploy it took *eight weeks*. By day seven of the pilot, 93% of agents were using it. Adoption was organic because the pain was real.

A third use case, **Instant Answers** became an exercise in *what problem are we trying to solve here?* A stakeholder pushed an internal chatbot as the answer to the problem of agents skipping the knowledge-base to answer questions during a call. Instead of arguing against it, I ran a limited test with a few managers and agents. The chatbot introduced yet another interface for the agents, lacked trust, inevitably sending agents back to the group chat they were already using. 

I took a recommendation to steerco to kill UC3 and concentrate runway on the first two use cases. Steerco agreed. That trade-off became part of the operating model's argument for why governance needed a pilot-specific lane: you have to be able to kill things quickly when the evidence says so.

The contrast between the three use cases became the sharpest evidence in the operating model. When the problem is framed as an institutional cost target, adoption fractures along individual behaviour. When the problem is one agents experience directly, adoption takes care of itself.

## Structures as fortress walls

In regulated spaces, risk becomes almost a personal liability, and as such, every approval we navigated became material for the operating model. The conditions for deployment were opaque. They emerged over weeks of meetings with stakeholders whose roles in the process weren't official or documented. Risks raised pertained to scaled production tooling, not a 15-agent pilot. There was no pilot-specific risk framework. The organization applied the same governance to a controlled test that it would apply to an enterprise rollout.

The delivery model was optimized for certainty and scale, performing as designed. The merger had consumed the discretionary capacity that might otherwise have allowed a lighter-weight path for us. What implementing the pilots exposed was a structural gap in that the organization had no way to run a small experiment without triggering the full weight of production governance. *Building that capability was the operating model's central recommendation.*

![Shawn standing at a whiteboard facilitating a workshop with Fairstone agent managers](/img/fairstone-op-model_1_20260618A.jpg)
`Facilitation jazz hands — building AI trust with Fairstone managers`

## Embedded always wins

Most of the operating model depth came from sitting with agents in Montréal across multiple observation sessions, time-series analysis, interviews with managers and the agent trainer, and shadowing their workflows. Agents were taking notes outside their allotted after-call wrap up time. Some so they wouldn't forget. Others to engineer a small break before the next call. They were already saving handle time in ways the system didn't and *couldn't* measure.

The notes themselves were load-bearing, meaning agents use them to communicate with each other on callbacks. They capture what the customer and the agent never talked about. None of that could ever be summarized by a model trained on the call transcript. And QA scores the agents on note quality, so agents who relied on AI summaries would be marked down for the work the AI couldn't see. This is where the adoption of AI Summaries met its biggest barrier. 

Fairstone needed to change its notes policy before the summary technology could land. The most engrained behaviour in the contact centre, trained from day one, was the thing the technology had to negotiate with. It was my recommendation to change the notes policy in the interim, and completely overhaul it over the long run.

![Furious late evening whiteboard strategy session](/img/fairstone-op-model_2_20260618A.jpg)
`Furious late evening whiteboard strategy session to kill UC3`

## Change as architecture

The change program started in the service design, built from what I observed on the ground, working shoulder-to-shoulder, embedded with agents, managers, and contact centre leadership. I got a badge I was there so much. Three things emerged as a catalyst for the change program:

#### Reprogramming the managers
The pre-existing agent management style was authoritative. Reinforcement happened with a stick. I ran an AI trust workshop (that's me above, with the jazz hands) where the managers' real concerns came out: AI would make agents lazy… AI would erode the note quality they'd coached for years. AI couldn't be trusted to provide accurate answers. All legitimate concerns, reinforced by policies, procedures, and through actions that trickle down (whether they know it or not) to the agents. Through training and enablement I worked with managers individually to move them from criticism toward coaching, powered by AI synthesis of individual agent adoption with custom coaching guidance.

#### Altering the measurement system
Working with the contact centre director, I got leadership to ease some metrics agents were graded on during the pilot phase—namely notes quality. This was the structural reconfiguration that made cultural change possible. You can't ask managers to coach a test-and-learn behaviour with agents while holding them against metrics that punish it.

#### The agent trainer as key lever
Late in the project, one person emerged as the true agent champion, and that was the agents' trainer. She is the person who shapes how every new agent learns the work and the in-house authority on what counts as good. Her participation was the difference between agents abandoning the tools, and trusting them because they trusted her.

## What the work proved

93% adoption of Magic Autofill and AI Summaries across 26 pilot agents over seven weeks. Voluntary use, not mandated. The original business case projected 81 seconds of savings and $5M over five years. The pilots revised that to 46 seconds and $3M due to the applied learnings, proving the test-and-learn method worked—a loop that corrects assumptions before they scale.

The operating model we delivered aggregated everything the pilots surfaced into structural recommendations. We recommended a pilot-specific governance lane, a product management function the organization lacked, funding and resourcing models for innovation work that doesn't fit the enterprise delivery pipeline, and the change architecture to make any of it stick. Fairstone hired a VP of Innovation whose mandate is to realize these recommendations over three to five years. The pilot handoff went to named owners: the director, the agent trainer, and the managers closest to the work are still running it because we didn't leave until they were ready to.

The pilots shipped, yes, but the lasting deliverable was the operating model and the conviction behind it. **Organizations trying to adopt AI will hit a delivery model wall before they hit a technology limitation.** The structural conditions for adoption (governance freedom, dedicated ownership, measurement systems that reward learning) have to exist before any technology can make an impact. Every contact centre running AI pilots at scale, from Ally to Lloyds to Nordea, figured this out. The pilots were how Fairstone figured it out too.