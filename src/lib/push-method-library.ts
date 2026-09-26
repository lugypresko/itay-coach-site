export type MethodBranch = { answer_meaning: string; leading_hypothesis: string; leading_label: string; weakens: string[]; must_not_claim: string[]; open_loop_template: string; allowed_experiments: string[] };
export const METHOD_BRANCHES: Record<string, Record<string, MethodBranch>> = {
  "decision_escalation": {
    "A": {
      "answer_meaning": "The people involved appear to have had enough context and authority to make a reasonable decision without the manager.",
      "leading_hypothesis": "decision_dependency",
      "leading_label": "Decision dependency",
      "weakens": [
        "context_authority_gap_as_primary_explanation"
      ],
      "must_not_claim": [
        "important_context_was_missing",
        "authority_was_missing",
        "the_manager_had_to_decide_because_only_the_manager_had_authority"
      ],
      "open_loop_template": "Why did the decision still return upward if the people involved already had enough context and authority to decide?",
      "allowed_experiments": [
        "decision_owner_escalation_rule"
      ]
    },
    "B": {
      "answer_meaning": "Something important was genuinely missing for a safe decision: context, authority, or a decision boundary.",
      "leading_hypothesis": "context_authority_gap",
      "leading_label": "Context / authority gap",
      "weakens": [
        "pure_decision_dependency_as_primary_explanation"
      ],
      "must_not_claim": [
        "they_already_had_everything_needed_to_decide",
        "approval_habit_is_the_primary_cause"
      ],
      "open_loop_template": "What exactly was missing for a safe decision, and why was it not available at the point of decision?",
      "allowed_experiments": [
        "make_decision_inputs_explicit"
      ]
    },
    "mixed": {
      "answer_meaning": "The decision boundary was only partly sufficient, so both missing inputs and upward approval may be contributing.",
      "leading_hypothesis": "mixed_decision_mechanisms",
      "leading_label": "Two decision mechanisms may be operating",
      "weakens": [],
      "must_not_claim": [
        "one_mechanism_is_proven"
      ],
      "open_loop_template": "Which blocker repeats more often: missing context or authority, or a decision that still returns upward after those are sufficient?",
      "allowed_experiments": [
        "separate_decision_blockers"
      ]
    }
  },
  "ownership": {
    "A": {
      "answer_meaning": "The owner already knew the decision boundary, yet ownership still returned upward.",
      "leading_hypothesis": "ownership_dependency",
      "leading_label": "Ownership dependency",
      "weakens": [
        "boundary_ambiguity_as_primary_explanation"
      ],
      "must_not_claim": [
        "the_owner_did_not_know_the_boundary"
      ],
      "open_loop_template": "Why does ownership still return upward when the decision boundary is already clear?",
      "allowed_experiments": [
        "owner_decides_with_clear_boundary"
      ]
    },
    "B": {
      "answer_meaning": "The owner did not have a sufficiently clear boundary for what they could decide without the manager.",
      "leading_hypothesis": "boundary_ambiguity",
      "leading_label": "Decision-boundary ambiguity",
      "weakens": [
        "pure_ownership_avoidance_as_primary_explanation"
      ],
      "must_not_claim": [
        "the_boundary_was_already_clear"
      ],
      "open_loop_template": "Which part of the decision boundary is ambiguous enough to send ownership back upward?",
      "allowed_experiments": [
        "write_decision_boundary"
      ]
    },
    "mixed": {
      "answer_meaning": "The boundary is partly understood but becomes unreliable under pressure.",
      "leading_hypothesis": "pressure_sensitive_boundary",
      "leading_label": "A boundary that breaks under pressure",
      "weakens": [],
      "must_not_claim": [
        "the_boundary_is_fully_clear",
        "the_boundary_is_completely_missing"
      ],
      "open_loop_template": "What changes under pressure that makes an otherwise usable ownership boundary collapse?",
      "allowed_experiments": [
        "pressure_boundary_test"
      ]
    }
  },
  "coordination": {
    "A": {
      "answer_meaning": "Both sides appear to have had enough shared context, yet the manager was still needed as the connector.",
      "leading_hypothesis": "coordination_dependency",
      "leading_label": "Coordination dependency",
      "weakens": [
        "shared_context_gap_as_primary_explanation"
      ],
      "must_not_claim": [
        "shared_context_was_missing_as_the_primary_reason"
      ],
      "open_loop_template": "Why are the sides still relying on the manager to connect them when enough shared context already exists?",
      "allowed_experiments": [
        "direct_owner_resolution"
      ]
    },
    "B": {
      "answer_meaning": "The sides genuinely lacked enough shared context to resolve the issue directly.",
      "leading_hypothesis": "shared_context_gap",
      "leading_label": "Shared-context gap",
      "weakens": [
        "pure_coordination_dependency_as_primary_explanation"
      ],
      "must_not_claim": [
        "both_sides_already_had_enough_shared_context"
      ],
      "open_loop_template": "Where does shared context break down before the two sides can resolve the issue directly?",
      "allowed_experiments": [
        "shared_context_packet"
      ]
    },
    "mixed": {
      "answer_meaning": "Some shared context exists, but not enough to know whether the main mechanism is missing context or reliance on the manager as connector.",
      "leading_hypothesis": "mixed_coordination_mechanisms",
      "leading_label": "Two coordination mechanisms may be operating",
      "weakens": [],
      "must_not_claim": [
        "one_coordination_mechanism_is_proven"
      ],
      "open_loop_template": "Which repeats more often: missing shared context, or dependence on the manager even when the context is sufficient?",
      "allowed_experiments": [
        "coordination_blocker_log"
      ]
    }
  },
  "capacity": {
    "A": {
      "answer_meaning": "If the temporary load disappeared, the displaced leadership work would mostly fit back into the week.",
      "leading_hypothesis": "temporary_load_spike",
      "leading_label": "Temporary load spike",
      "weakens": [
        "structural_role_compression_as_primary_explanation"
      ],
      "must_not_claim": [
        "the_role_is_structurally_overloaded_as_primary_explanation"
      ],
      "open_loop_template": "Which temporary load is displacing leadership work, and does removing it actually restore that work?",
      "allowed_experiments": [
        "remove_temporary_load_test"
      ]
    },
    "B": {
      "answer_meaning": "Even without the temporary load, the role would still be too compressed to reliably protect leadership work.",
      "leading_hypothesis": "role_compression",
      "leading_label": "Role compression",
      "weakens": [
        "temporary_spike_as_sufficient_explanation"
      ],
      "must_not_claim": [
        "the_problem_would_mostly_disappear_if_temporary_load_went_away"
      ],
      "open_loop_template": "Which recurring responsibility is structurally crowding leadership work out of the role?",
      "allowed_experiments": [
        "role_load_reallocation"
      ]
    },
    "mixed": {
      "answer_meaning": "Temporary load contributes, but removing it would not fully restore leadership capacity.",
      "leading_hypothesis": "mixed_capacity_mechanisms",
      "leading_label": "Temporary load plus structural compression",
      "weakens": [],
      "must_not_claim": [
        "temporary_load_alone_explains_the_problem",
        "structural_compression_alone_is_proven"
      ],
      "open_loop_template": "How much of the displacement comes from temporary load versus recurring responsibilities built into the role?",
      "allowed_experiments": [
        "capacity_vs_structure_log"
      ]
    }
  },
  "unclear": {
    "A": {
      "answer_meaning": "A similar structure has appeared in other cases, but the mechanism is not yet specific enough to name safely.",
      "leading_hypothesis": "recurring_structure_unresolved",
      "leading_label": "Recurring structure — mechanism unresolved",
      "weakens": [
        "pure_one_off_event"
      ],
      "must_not_claim": [
        "a_specific_management_mechanism_is_proven"
      ],
      "open_loop_template": "What common mechanism appears across the comparable cases?",
      "allowed_experiments": [
        "observe_second_case"
      ]
    },
    "B": {
      "answer_meaning": "The event appears unusual rather than a stable pattern.",
      "leading_hypothesis": "one_off_event",
      "leading_label": "One-off event",
      "weakens": [
        "stable_recurring_pattern"
      ],
      "must_not_claim": [
        "a_recurring_management_pattern_is_established"
      ],
      "open_loop_template": "Does the same structure appear again strongly enough to justify treating it as a pattern?",
      "allowed_experiments": [
        "observe_second_case"
      ]
    },
    "mixed": {
      "answer_meaning": "There may be related cases, but the evidence is not strong enough to establish recurrence or mechanism.",
      "leading_hypothesis": "unclear_recurrence",
      "leading_label": "Pattern not yet established",
      "weakens": [],
      "must_not_claim": [
        "a_specific_pattern_is_proven"
      ],
      "open_loop_template": "Does the same structure repeat in another real case, and if so what stays constant?",
      "allowed_experiments": [
        "observe_second_case"
      ]
    }
  }
};
export const EXPERIMENT_LIBRARY: Record<string, { behavior: string; measure: string }> = {
  decision_owner_escalation_rule: {
    behavior: 'For the next comparable decision, name the decision owner in advance and define one explicit condition that genuinely requires escalation. If that condition is absent, the owner decides.',
    measure: 'Did the decision close at the intended level without waiting for you, and did any escalation meet the explicit condition?'
  },
  make_decision_inputs_explicit: {
    behavior: 'For one recurring decision, define before it starts the minimum information, authority, and guardrails required to decide safely.',
    measure: 'On the next occurrence, did the owner decide without asking for missing context or permission?'
  },
  separate_decision_blockers: {
    behavior: 'For the next 2–3 comparable decisions, mark the blocker as either missing context/authority or approval returning upward; resolve only that blocker.',
    measure: 'Which blocker repeats, and does resolving it let the decision close without manager intervention?'
  },
  owner_decides_with_clear_boundary: {
    behavior: 'For one owned decision whose boundary is already explicit, have the owner make the call and bring back the reasoning afterward rather than asking for approval beforehand.',
    measure: 'Did ownership stay with the named owner, and was any escalation based on a real exception?'
  },
  write_decision_boundary: {
    behavior: 'For one recurring owned decision, write the decision boundary: what the owner may decide, what requires consultation, and what truly requires escalation.',
    measure: 'On the next occurrence, did the owner know which path applied without asking you to redraw the boundary?'
  },
  pressure_boundary_test: {
    behavior: 'Pick one decision likely to occur under pressure and define the boundary plus the one pressure condition that changes it.',
    measure: 'When pressure appears, does the owner still decide within the boundary or does the work return upward?'
  },
  direct_owner_resolution: {
    behavior: 'For one cross-team issue, name the two owners who must resolve it directly and define one escalation condition for involving you.',
    measure: 'Did the issue close without you acting as translator or connector?'
  },
  shared_context_packet: {
    behavior: 'Before one recurring cross-team decision, make the minimum shared inputs explicit and available to both sides before discussion begins.',
    measure: 'Did both sides resolve the issue without needing you to supply missing context?'
  },
  coordination_blocker_log: {
    behavior: 'For the next 2–3 cross-team cases, mark whether the blocker was missing shared context or dependence on you as connector; address only that blocker.',
    measure: 'Which blocker repeats, and which intervention removes the need for your involvement?'
  },
  remove_temporary_load_test: {
    behavior: 'Remove, delegate, or defer one temporary load item for one week and protect the displaced leadership activity in the calendar.',
    measure: 'Did the leadership work reliably return when the temporary load was removed?'
  },
  role_load_reallocation: {
    behavior: 'Identify one recurring operating responsibility that is crowding out people leadership or strategic work and reassign, redesign, or bound it for one week.',
    measure: 'Did protected leadership work return without the operating responsibility simply bouncing back to you?'
  },
  capacity_vs_structure_log: {
    behavior: 'For one week, classify each displaced leadership block as caused by temporary load or by a recurring responsibility built into the role.',
    measure: 'Which cause accounts for most displacement by the end of the week?'
  },
  observe_second_case: {
    behavior: 'Capture the next comparable case using the same fields: actor, event, behavior, consequence, and qualifier. Do not intervene differently yet.',
    measure: 'Does the same structure appear again strongly enough to support a specific diagnostic fork?'
  }
};

export const READ_SIGNALS: Record<string, string[]> = {
  decision_dependency: [
    'They decide cleanly without waiting for you.',
    'They still escalate even though the explicit escalation condition is absent.',
    'They decide, but immediately seek reassurance afterward.'
  ],
  context_authority_gap: [
    'They decide once the missing inputs are explicit.',
    'A different missing input appears and the decision still stops.',
    'The inputs are sufficient, but the decision still returns upward.'
  ],
  mixed_decision_mechanisms: [
    'Missing context is the blocker in most comparable cases.',
    'The decision returns upward even when context is sufficient.',
    'The dominant blocker changes by decision type.'
  ],
  ownership_dependency: [
    'The owner makes the call and explains the reasoning afterward.',
    'The owner still asks for approval despite a clear boundary.',
    'The owner decides only when risk is low.'
  ],
  boundary_ambiguity: [
    'The written boundary is enough for the owner to decide.',
    'The owner still cannot tell which path applies.',
    'A new ambiguity appears under pressure.'
  ],
  pressure_sensitive_boundary: [
    'The boundary still works when pressure appears.',
    'Pressure causes the decision to return upward.',
    'Only one specific pressure condition breaks the boundary.'
  ],
  coordination_dependency: [
    'The two owners resolve the issue directly.',
    'They still pull you in despite having enough shared context.',
    'They resolve it, but only after you frame the disagreement.'
  ],
  shared_context_gap: [
    'The issue closes once the shared inputs are explicit.',
    'The sides still disagree even with the same context.',
    'A new missing input becomes the blocker.'
  ],
  mixed_coordination_mechanisms: [
    'Most cases fail because context is missing.',
    'Most cases fail because you are still the default connector.',
    'Both mechanisms repeat depending on the issue.'
  ],
  temporary_load_spike: [
    'Protected leadership work returns when temporary load is removed.',
    'The calendar refills with other operating work.',
    'Only part of the displaced work returns.'
  ],
  role_compression: [
    'Leadership work stays protected after one responsibility is redesigned.',
    'The responsibility simply bounces back to you.',
    'Another recurring operating responsibility fills the space.'
  ],
  mixed_capacity_mechanisms: [
    'Temporary load explains most displacement.',
    'Recurring role responsibilities explain most displacement.',
    'Both remain material after a week.'
  ],
  recurring_structure_unresolved: [
    'The same structure appears in another case.',
    'The next case looks different enough to weaken the pattern.',
    'One element repeats while the rest changes.'
  ],
  one_off_event: [
    'No comparable case appears.',
    'A similar case appears with the same structure.',
    'Only a superficial similarity appears.'
  ],
  unclear_recurrence: [
    'A second case reveals a stable common structure.',
    'The cases do not share a useful mechanism.',
    'More evidence is still needed.'
  ]
};

