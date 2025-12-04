<div align="center">
  <!-- <p align="center"> -->
  <h1 align="center"><strong>Awesome-AgenticRAG</strong></h1>
</div>

🔬 列举一些关于AgenticRAG的系列文章，以2025年开始，包括Search-O1，Search-R1

- [2025.01] [[Search-o1]](https://arxiv.org/abs/2501.05366) Search-o1: Agentic Search-Enhanced Large Reasoning Models 增强具有类似O1推理模式的LRMs的自主检索能力，使模型在推理过程中能动态检索外部知识，从而提高推理的准确性和可靠性
- [2025.02] [[O1 Embedder]](https://arxiv.org/abs/2502.07555) O1 Embedder: Let Retrievers Think Before Action 已经有很多训练LLM作为Embedder的工作，如何让Embedder在检索目标文档之前生成对输入查询有用的thoughts，类似于一个推理的过程？
- [2025.03] [[Search-R1]](https://arxiv.org/abs/2503.09516) Search-R1: Training LLMs to Reason and Leverage Search Engines with Reinforcement Learning 收到R1的启发，将强化学习扩展到RAG场景，将搜索引擎建模为强化学习环境的一部分，使LLM能通过试错自主学习；仅用最终答案正确性作为奖励信号，创新检索内容掩码
- [2025.03] [[ReSearch]](https://arxiv.org/abs/2503.19470) ReSearch: Learning to Reason with Search for LLMs via Reinforcement Learning 基本和Search-R1一样，不同点在于考虑了格式奖励，同时用的是F1 score
- [2025.03] [[R1-Searcher]](https://arxiv.org/abs/2503.05592) R1-Searcher: Incentivizing the Search Capability in LLMs via Reinforcement Learning 与Search-R1类似，不过采用的是基于两阶段RL框架，通过自主调用外部搜索工具增强LLM的回答能力，无过程奖励或蒸馏。仅依赖最终奖励。
- [2025.03] [DeepRetrieval](https://arxiv.org/abs/2503.00223) DeepRetrieval: Hacking Real Search Engines and Retrievers with Large Language Models via Reinforcement Learning 与前面基于答案匹配度作为奖励信号不同(前面主要是RAG的QA任务)，该工作主要聚焦在检索任务，以检索指标作为奖励信号，LLM通过查询增强的方式，补充原始查询的语义，然后进行检索
- [2025.04] [[DeepResearcher]](https://arxiv.org/abs/2504.03160) DeepResearcher: Scaling Deep Research via Reinforcement Learning in Real-World Environments 是现有搜索代理在实际环境中扩展困难，通过强化学习在真实环境中扩展深度研究能力，缺少在真实网络环境中，应对环境动态性，不可预测性，噪声、搜索网页质量差异和内容格式问题的强大Agent框架，不仅有Search还有Browse
- [2025.05] [[AutoRefine]](https://arxiv.org/pdf/2505.11277) Search and Refine During Think: Facilitating Knowledge Refinement for Improved Retrieval-Augmented Reasoning Search-R1检索到的文档往往包含无关内容，可能影响到模型有效利用新的知识。可以考虑边检索，边精炼的方式，使模型在检索过程中自我进化。同时精炼过程提供奖励，避免仅结果奖励
- [2025.05] [[IKEA]](https://arxiv.org/abs/2505.07596) IKEA: Reinforced Internal-External Knowledge Synergistic Reasoning for Efficient Adaptive Search Agent 解决现有搜索代理过度依赖外部搜索、未充分利用内部知识的问题，提出强化学习的内外部知识协同推理代理，识别知识边界，优先使用内部知识，减少冗余检索和知识冲突
- [2025.05] [[ZeroSearch]](https://arxiv.org/abs/2505.04588) ZeroSearch: Incentivize the Search Capability of LLMs without Searching 解决RL训练搜索代理时面临的文档质量不可控和API成本高昂两大挑战，无需真实搜索，直接用LLM模拟搜索引擎，引入课程学习策略，在降低88%成本的同时性能超过依赖真实搜索的方法

• [2025.05] [[s3]](https://arxiv.org/abs/2505.14146) s3: You Don't Need That Much Data to Train a Search Agent via RL 解决现有方法要么优化检索指标忽略下游效用，要么端到端训练导致搜索与生成纠缠的问题，提出轻量级框架解耦搜索器和生成器，仅用2.4k训练样本实现强大性能，提出Gain Beyond RAG奖励

• [2025.05] [[R1-Searcher++]](https://arxiv.org/abs/2505.17005) R1-Searcher++: Incentivizing the Dynamic Knowledge Acquisition of LLMs via Reinforcement Learning 作为R1-Searcher的增强版，解决如何更好地利用内部和外部知识的问题，采用两阶段策略，引入内部知识利用奖励机制和记忆机制，实现动态知识获取

• [2025.05] [[Search Wisely]](https://arxiv.org/abs/2505.17281) Search Wisely: Mitigating Sub-optimal Agentic Searches By Reducing Uncertainty 解决代理搜索中存在的不确定性导致次优搜索行为的问题，通过减少不确定性来缓解次优的代理搜索，提高搜索效率和质量

• [2025.05] [[EvolveSearch]](https://arxiv.org/abs/2505.22501) EvolveSearch: An Iterative Self-Evolving Search Agent 解决当前搜索代理需要外部人工标注推理轨迹的问题，提出迭代自进化框架，协同结合RL与SFT，无需外部人工标注即可提升网络搜索能力，实现自我进化

• [2025.08] [[Self-Search RL]](https://arxiv.org/abs/2508.10874) SSRL: Self-Search Reinforcement Learning 研究LLM作为RL任务模拟器的潜力，减少对外部搜索引擎的昂贵交互依赖，通过结构化提示和重复采样量化LLM的内在搜索能力，增强自我搜索能力

• [2025.08] [[ASearcher]](https://arxiv.org/abs/2508.07976) Beyond Ten Turns: Unlocking Long-Horizon Agentic Search with Large-Scale Asynchronous RL 解决长视野搜索任务的挑战，通过大规模异步强化学习解锁长视野代理搜索能力，支持超过十轮以上的复杂搜索交互

• [2025.10] [[QAgent]](https://arxiv.org/abs/2510.08383) QAgent: A modular Search Agent with Interactive Query Understanding 解决传统RAG难以理解复杂查询、RL训练搜索代理泛化和部署困难的问题，提出模块化搜索代理框架，通过交互式推理和检索优化查询理解，即插即用于复杂系统

• [2025.10] [[INFOFLOW]](https://arxiv.org/abs/2510.26575) InfoFlow: Reinforcing Search Agent via Reward Density Optimization 解决深度搜索场景中奖励密度低、探索成本高的问题，提出奖励密度优化框架，通过子问题分解、失败引导提示和双代理精炼三方面提高奖励密度和训练效率

• [2025.10] [[SEARCH SELF-PLAY]](https://arxiv.org/abs/2510.18821) Search Self-play: Pushing the Frontier of Agent Capability without Supervision 解决无监督情况下如何提升代理能力的问题，通过自我博弈强化学习，无需监督即可推动代理能力边界

• [2025.10] [[Repurposing Synthetic Data]](https://arxiv.org/abs/2510.24694) Repurposing Synthetic Data for Fine-grained Search Agent Supervision 解决GRPO方法缺乏细粒度监督信号的问题，提出E-GRPO框架，利用合成数据中的实体信息作为细粒度奖励，解决"近失"问题，提升复杂搜索任务性能

• [2025.10] [[GlobalRAG]](https://arxiv.org/abs/2510.20548) GlobalRAG: Enhancing Global Reasoning in Multi-hop Question Answering via Reinforcement Learning 解决多跳QA中缺乏全局规划和不忠实执行的问题，通过强化学习增强全局推理，分解问题为子目标，协调检索与推理，仅使用8k训练数据就实现显著性能提升

**注**：未找到AutoRefine和ReAgent的明确匹配文章，可能名称不准确或尚未在arXiv上发表。
